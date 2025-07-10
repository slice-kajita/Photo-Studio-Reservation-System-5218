import supabase from '../lib/supabase';
import { sendBookingNotifications } from './emailService';

export const createBooking = async (bookingData) => {
  try {
    console.log('🔄 予約作成開始...', bookingData.name);

    // 日付を正しく処理（タイムゾーンの問題を修正）
    const bookingDate = new Date(bookingData.date);
    const localDateString = bookingDate.getFullYear() + '-' + 
      String(bookingDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(bookingDate.getDate()).padStart(2, '0');

    console.log('📅 予約日付:', {
      original: bookingData.date,
      formatted: localDateString,
      iso: bookingData.date.toISOString()
    });

    // Insert booking
    const { data: booking, error } = await supabase
      .from('bookings_summer2025')
      .insert([{
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        participants: bookingData.participants,
        child_age: bookingData.childAge || null,
        requests: bookingData.requests || null,
        booking_date: localDateString, // ローカル日付文字列を使用
        booking_time: bookingData.time,
        is_weekend: bookingData.isWeekend,
        base_price: bookingData.basePrice,
        total_price: bookingData.totalPrice,
        campaign_type: bookingData.campaignType,
        status: 'confirmed'
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ データベース挿入エラー:', error);
      throw error;
    }

    console.log('✅ 予約データ保存完了:', booking.id);

    // Update time slot availability
    const { error: slotError } = await supabase
      .from('time_slots_summer2025')
      .upsert({
        date: localDateString, // 同じ形式を使用
        time: bookingData.time,
        is_available: false,
        booking_id: booking.id
      });

    if (slotError) {
      console.error('⚠️ 時間枠更新エラー:', slotError);
    } else {
      console.log('✅ 時間枠更新完了');
    }

    // Send email notifications
    console.log('📧 メール通知送信開始...');
    try {
      const emailResult = await sendBookingNotifications({
        ...bookingData,
        id: booking.id
      });
      if (emailResult.success) {
        console.log('✅ メール通知送信完了');
      } else {
        console.error('⚠️ メール送信に問題がありました:', emailResult.error);
      }
    } catch (emailError) {
      console.error('⚠️ メール送信エラー:', emailError);
      // Don't fail the booking if email fails
    }

    return { success: true, booking };
  } catch (error) {
    console.error('❌ 予約作成エラー:', error);
    return { success: false, error: error.message };
  }
};

export const getBookedSlots = async (date) => {
  try {
    // 日付を正しく処理
    const bookingDate = new Date(date);
    const localDateString = bookingDate.getFullYear() + '-' + 
      String(bookingDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(bookingDate.getDate()).padStart(2, '0');

    console.log('📅 予約済み時間枠取得:', localDateString);

    const { data, error } = await supabase
      .from('time_slots_summer2025')
      .select('time')
      .eq('date', localDateString)
      .eq('is_available', false);

    if (error) throw error;

    const bookedTimes = data.map(slot => slot.time.substring(0, 5)); // Format HH:MM
    console.log('⏰ 予約済み時間:', bookedTimes);
    
    return bookedTimes;
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return [];
  }
};

export const getAllBookings = async () => {
  try {
    console.log('📋 全予約取得開始...');
    
    const { data, error } = await supabase
      .from('bookings_summer2025')
      .select('*')
      .order('booking_date', { ascending: true });

    if (error) {
      console.error('❌ 予約取得エラー:', error);
      throw error;
    }

    console.log('✅ 予約取得完了:', data?.length || 0, '件');
    return data || [];
  } catch (error) {
    console.error('❌ 予約取得処理エラー:', error);
    return [];
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    console.log('🔄 ステータス更新開始:', { bookingId, status });

    if (!bookingId || !status) {
      throw new Error('予約IDまたはステータスが不正です');
    }

    // First verify the booking exists
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings_summer2025')
      .select('id, booking_date, booking_time, status')
      .eq('id', bookingId)
      .single();

    if (fetchError) {
      console.error('❌ 予約確認エラー:', fetchError);
      throw new Error('予約が見つかりません');
    }

    console.log('📋 更新対象予約:', existingBooking);

    // Update the booking status
    const { data, error } = await supabase
      .from('bookings_summer2025')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('❌ ステータス更新エラー:', error);
      throw error;
    }

    console.log('✅ ステータス更新完了:', data);

    // Handle time slot availability based on status
    if (status === 'cancelled') {
      console.log('🔄 キャンセルによる時間枠解放...');
      
      const { error: slotError } = await supabase
        .from('time_slots_summer2025')
        .update({ 
          is_available: true, 
          booking_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('booking_id', bookingId);

      if (slotError) {
        console.error('⚠️ 時間枠解放エラー:', slotError);
      } else {
        console.log('✅ 時間枠解放完了');
      }
    } else if (existingBooking.status === 'cancelled' && status !== 'cancelled') {
      console.log('🔄 キャンセル解除による時間枠確保...');
      
      const { error: slotError } = await supabase
        .from('time_slots_summer2025')
        .upsert({
          date: existingBooking.booking_date,
          time: existingBooking.booking_time,
          is_available: false,
          booking_id: bookingId,
          updated_at: new Date().toISOString()
        });

      if (slotError) {
        console.error('⚠️ 時間枠確保エラー:', slotError);
      } else {
        console.log('✅ 時間枠確保完了');
      }
    }

    return { success: true, booking: data };
  } catch (error) {
    console.error('❌ ステータス更新処理エラー:', error);
    return { success: false, error: error.message };
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    console.log('🗑️ 予約削除開始:', bookingId);

    if (!bookingId) {
      throw new Error('予約IDが不正です');
    }

    // First, get the booking details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings_summer2025')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError) {
      console.error('❌ 予約取得エラー:', fetchError);
      if (fetchError.code === 'PGRST116') {
        throw new Error('予約が見つかりません');
      }
      throw fetchError;
    }

    console.log('📋 削除対象予約:', booking);

    // Delete related email notifications first
    console.log('🔄 関連メール通知削除...');
    const { error: emailError } = await supabase
      .from('email_notifications_summer2025')
      .delete()
      .eq('booking_id', bookingId);

    if (emailError) {
      console.error('⚠️ メール通知削除エラー:', emailError);
      // Continue with deletion process
    } else {
      console.log('✅ メール通知削除完了');
    }

    // Free up the time slot
    console.log('🔄 時間枠解放...');
    const { error: slotError } = await supabase
      .from('time_slots_summer2025')
      .delete()
      .eq('booking_id', bookingId);

    if (slotError) {
      console.error('⚠️ 時間枠解放エラー:', slotError);
      // Continue with deletion process
    } else {
      console.log('✅ 時間枠解放完了');
    }

    // Delete the booking
    console.log('🔄 予約データ削除...');
    const { error: deleteError } = await supabase
      .from('bookings_summer2025')
      .delete()
      .eq('id', bookingId);

    if (deleteError) {
      console.error('❌ 予約削除エラー:', deleteError);
      throw deleteError;
    }

    console.log('✅ 予約削除完了:', bookingId);
    return { success: true, deletedBooking: booking };
  } catch (error) {
    console.error('❌ 予約削除処理エラー:', error);
    return { success: false, error: error.message };
  }
};

// Get email notifications for a booking
export const getEmailNotifications = async (bookingId) => {
  try {
    if (!bookingId) {
      return [];
    }

    const { data, error } = await supabase
      .from('email_notifications_summer2025')
      .select('*')
      .eq('booking_id', bookingId)
      .order('sent_at', { ascending: false });

    if (error) {
      console.warn('Email notifications fetch error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching email notifications:', error);
    return [];
  }
};

// Test database connection and permissions - FIXED VERSION
export const testDatabaseConnection = async () => {
  try {
    console.log('🔍 データベース接続テスト開始...');
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('bookings_summer2025')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ 基本接続テスト失敗:', connectionError);
      return { 
        success: false, 
        error: 'Database connection failed',
        details: connectionError.message || connectionError
      };
    }

    console.log('✅ 基本接続テスト成功');

    // Test read access with actual data
    const { data: readTest, error: readError } = await supabase
      .from('bookings_summer2025')
      .select('id, name, status')
      .limit(5);

    if (readError) {
      console.error('❌ 読み取りテスト失敗:', readError);
      return { 
        success: false, 
        error: 'Read access denied', 
        details: readError.message || readError 
      };
    }

    console.log('✅ 読み取りテスト成功 - データ件数:', readTest?.length || 0);

    // Test write access (try to update a non-existent record to check permissions)
    const { error: writeTestError } = await supabase
      .from('bookings_summer2025')
      .update({ status: 'confirmed' })
      .eq('id', '00000000-0000-0000-0000-000000000000'); // Non-existent ID

    // If we get a permissions error, that's what we're looking for
    let writeAccess = true;
    if (writeTestError) {
      if (writeTestError.code === '42501' || writeTestError.message?.includes('permission')) {
        writeAccess = false;
        console.warn('⚠️ 書き込み権限なし:', writeTestError);
      } else {
        // Other errors are fine (like record not found)
        console.log('✅ 書き込み権限テスト完了');
      }
    }

    // Test delete access (try to delete a non-existent record)
    const { error: deleteTestError } = await supabase
      .from('bookings_summer2025')
      .delete()
      .eq('id', '00000000-0000-0000-0000-000000000000'); // Non-existent ID

    let deleteAccess = true;
    if (deleteTestError) {
      if (deleteTestError.code === '42501' || deleteTestError.message?.includes('permission')) {
        deleteAccess = false;
        console.warn('⚠️ 削除権限なし:', deleteTestError);
      } else {
        console.log('✅ 削除権限テスト完了');
      }
    }

    // Get table info safely
    let tableInfo = null;
    try {
      const { data: tableData } = await supabase
        .from('bookings_summer2025')
        .select('*')
        .limit(1)
        .single();
      
      if (tableData) {
        tableInfo = {
          columns: Object.keys(tableData),
          sampleRecord: !!tableData
        };
      }
    } catch (error) {
      console.log('📋 テーブル情報取得スキップ:', error.message);
    }

    const result = {
      success: true,
      connection: true,
      readAccess: true,
      writeAccess,
      deleteAccess,
      recordCount: readTest?.length || 0,
      tableInfo,
      timestamp: new Date().toISOString()
    };

    console.log('✅ データベース接続テスト完了:', result);
    return result;

  } catch (error) {
    console.error('❌ データベース接続テスト失敗:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown database error',
      timestamp: new Date().toISOString()
    };
  }
};