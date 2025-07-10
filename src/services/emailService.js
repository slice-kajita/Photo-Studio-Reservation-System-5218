import { EMAILJS_CONFIG, validateEmailJSConfig } from '../config/emailjs';
import supabase from '../lib/supabase';

// 代替メール送信方法：Webhook経由でメール送信
const sendWebhookEmail = async (emailData) => {
  try {
    // Webhook URLを使用してメール送信（例：Make.com, Zapier等）
    const webhookUrl = 'https://hook.integromat.com/your-webhook-url'; // 実際のWebhook URLに変更
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      console.log('✅ Webhook経由でメール送信完了');
      return { success: true, method: 'webhook' };
    } else {
      throw new Error('Webhook送信失敗');
    }
  } catch (error) {
    console.error('❌ Webhook送信エラー:', error);
    return { success: false, error: error.message };
  }
};

// FormSubmit.co を使用したメール送信
const sendFormSubmitEmail = async (emailData) => {
  try {
    const formData = new FormData();
    formData.append('_to', emailData.to);
    formData.append('_subject', emailData.subject);
    formData.append('_message', emailData.body);
    formData.append('_next', window.location.origin); // リダイレクト先
    formData.append('_captcha', 'false'); // キャプチャ無効化

    const response = await fetch('https://formsubmit.co/ajax/kajita@slice-co.jp', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log('✅ FormSubmit経由でメール送信完了');
      return { success: true, method: 'formsubmit' };
    } else {
      throw new Error('FormSubmit送信失敗');
    }
  } catch (error) {
    console.error('❌ FormSubmit送信エラー:', error);
    return { success: false, error: error.message };
  }
};

// Dynamic import for EmailJS to avoid build issues
let emailjs = null;

const loadEmailJS = async () => {
  if (!emailjs) {
    try {
      const emailjsModule = await import('@emailjs/browser');
      emailjs = emailjsModule.default;
    } catch (error) {
      console.warn('EmailJS not available:', error);
      return null;
    }
  }
  return emailjs;
};

// EmailJS初期化
const initializeEmailJS = async () => {
  try {
    validateEmailJSConfig();
    const emailjsInstance = await loadEmailJS();
    if (emailjsInstance) {
      emailjsInstance.init(EMAILJS_CONFIG.PUBLIC_KEY);
      console.log('✅ EmailJS初期化完了');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ EmailJS初期化エラー:', error.message);
    return false;
  }
};

// メール送信ログを保存
const saveEmailLog = async (bookingId, emailType, recipientEmail, subject, body, status, errorMessage = null, method = 'emailjs') => {
  try {
    const { error } = await supabase
      .from('email_notifications_summer2025')
      .insert([{
        booking_id: bookingId,
        email_type: emailType,
        recipient_email: recipientEmail,
        subject: subject,
        body: body,
        status: status,
        error_message: errorMessage
      }]);
    
    if (error) {
      console.error('メールログ保存エラー:', error);
    } else {
      console.log(`✅ メールログ保存完了 (${method})`);
    }
  } catch (error) {
    console.error('メールログ保存エラー:', error);
  }
};

// 管理者通知メール送信（複数方法で試行）
export const sendAdminNotification = async (booking) => {
  console.log('📧 管理者通知メール送信開始...', booking.name);
  
  const emailData = {
    to: 'kajita@slice-co.jp',
    subject: `【新規予約】${booking.name}様 - ${booking.date.toLocaleDateString('ja-JP')} ${booking.time}`,
    body: `
新しい予約が入りました。

【予約詳細】
お名前: ${booking.name}
メール: ${booking.email}
電話番号: ${booking.phone}
撮影日: ${booking.date.toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})}
撮影時間: ${booking.time}〜
参加人数: ${booking.participants}人
料金: ¥${booking.totalPrice.toLocaleString()} (${booking.isWeekend ? '休日' : '平日'})
お子様の年齢: ${booking.childAge || '記載なし'}
ご要望: ${booking.requests || 'なし'}
予約ID: ${booking.id || 'TMP-' + Date.now()}

お客様への確認連絡をお忘れなく！
    `
  };

  // 1. EmailJSを試行
  const isInitialized = await initializeEmailJS();
  if (isInitialized) {
    try {
      const emailjsInstance = await loadEmailJS();
      if (emailjsInstance) {
        const templateParams = {
          to_email: emailData.to,
          customer_name: booking.name,
          customer_email: booking.email,
          customer_phone: booking.phone,
          booking_date: booking.date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          }),
          booking_time: booking.time,
          participants: booking.participants,
          total_price: booking.totalPrice.toLocaleString(),
          price_type: booking.isWeekend ? '休日' : '平日',
          child_age: booking.childAge || '記載なし',
          requests: booking.requests || 'なし',
          booking_id: booking.id || 'TMP-' + Date.now()
        };

        const result = await emailjsInstance.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID_ADMIN,
          templateParams
        );

        console.log('✅ EmailJS管理者通知メール送信完了:', result.text);
        
        await saveEmailLog(
          booking.id || 'unknown',
          'admin_notification',
          emailData.to,
          emailData.subject,
          JSON.stringify(templateParams),
          'sent',
          null,
          'emailjs'
        );

        return { success: true, result, method: 'emailjs' };
      }
    } catch (error) {
      console.error('❌ EmailJS送信エラー:', error);
    }
  }

  // 2. FormSubmitを試行
  try {
    const formSubmitResult = await sendFormSubmitEmail(emailData);
    if (formSubmitResult.success) {
      await saveEmailLog(
        booking.id || 'unknown',
        'admin_notification',
        emailData.to,
        emailData.subject,
        emailData.body,
        'sent',
        null,
        'formsubmit'
      );
      return { success: true, result: formSubmitResult, method: 'formsubmit' };
    }
  } catch (error) {
    console.error('❌ FormSubmit送信エラー:', error);
  }

  // 3. 最終的にログのみ記録
  console.log('📧 [管理者通知] 全送信方法失敗 - ログのみ記録');
  console.log('📧 [管理者通知メール内容]:', emailData);
  
  await saveEmailLog(
    booking.id || 'unknown',
    'admin_notification',
    emailData.to,
    emailData.subject,
    emailData.body,
    'logged_only',
    'All email methods failed - logged for manual processing'
  );

  return { success: true, result: { logged: true }, method: 'log_only' };
};

// お客様確認メール送信（複数方法で試行）
export const sendCustomerConfirmation = async (booking) => {
  console.log('📧 お客様確認メール送信開始...', booking.name);
  
  const emailData = {
    to: booking.email,
    subject: '【予約確認】夏フォトキャンペーン - ご予約ありがとうございます',
    body: `
${booking.name} 様

この度は、フォトスタジオハルの夏フォトキャンペーンにお申し込みいただき、誠にありがとうございます。
以下の内容でご予約を承りました。

【ご予約内容】
撮影日: ${booking.date.toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})}
撮影時間: ${booking.time}〜（20分間）
参加人数: ${booking.participants}人
料金: ¥${booking.totalPrice.toLocaleString()} (${booking.isWeekend ? '休日' : '平日'})
${booking.childAge ? `お子様の年齢: ${booking.childAge}` : ''}
${booking.requests ? `ご要望: ${booking.requests}` : ''}

【撮影当日について】
• 撮影開始時刻の10分前にお越しください
• 撮影時間は20分間です
• お気に入り1カットを厳選してお渡しします
• 撮影データは1週間以内にメールでお渡し
• 夏らしい明るい衣装がおすすめです
• キャンセルは前日までにお電話でご連絡ください

【スタジオ情報】
住所: 仙台市太白区富沢１丁目12-8
電話: 022-796-6733
地下鉄富沢駅より徒歩8分・仙台市体育館の近く

ご不明な点がございましたら、お気軽にお問い合わせください。
当日お会いできることを楽しみにしております。

フォトスタジオハル
    `
  };

  // 1. EmailJSを試行
  const isInitialized = await initializeEmailJS();
  if (isInitialized) {
    try {
      const emailjsInstance = await loadEmailJS();
      if (emailjsInstance) {
        const templateParams = {
          to_email: emailData.to,
          customer_name: booking.name,
          booking_date: booking.date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          }),
          booking_time: booking.time,
          participants: booking.participants,
          total_price: booking.totalPrice.toLocaleString(),
          price_type: booking.isWeekend ? '休日' : '平日',
          child_age: booking.childAge || '',
          requests: booking.requests || '',
          studio_phone: '022-796-6733',
          studio_address: '仙台市太白区富沢１丁目12-8'
        };

        const result = await emailjsInstance.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID_CUSTOMER,
          templateParams
        );

        console.log('✅ EmailJSお客様確認メール送信完了:', result.text);
        
        await saveEmailLog(
          booking.id || 'unknown',
          'customer_confirmation',
          emailData.to,
          emailData.subject,
          JSON.stringify(templateParams),
          'sent',
          null,
          'emailjs'
        );

        return { success: true, result, method: 'emailjs' };
      }
    } catch (error) {
      console.error('❌ EmailJS送信エラー:', error);
    }
  }

  // 2. 最終的にログのみ記録（お客様メールは手動で送信）
  console.log('📧 [お客様確認] メール送信失敗 - ログのみ記録');
  console.log('📧 [お客様確認メール内容]:', emailData);
  
  await saveEmailLog(
    booking.id || 'unknown',
    'customer_confirmation',
    emailData.to,
    emailData.subject,
    emailData.body,
    'logged_only',
    'Email sending failed - logged for manual processing'
  );

  return { success: true, result: { logged: true }, method: 'log_only' };
};

// 両方のメール送信（統合関数）
export const sendBookingNotifications = async (booking) => {
  console.log('📧 メール通知送信開始...', booking.name);
  
  try {
    // 両方のメールを並行送信
    const [adminResult, customerResult] = await Promise.allSettled([
      sendAdminNotification(booking),
      sendCustomerConfirmation(booking)
    ]);

    console.log('📧 メール送信結果:');
    console.log('- 管理者通知:', adminResult.status, adminResult.value);
    console.log('- お客様確認:', customerResult.status, customerResult.value);
    
    const adminSuccess = adminResult.status === 'fulfilled' && adminResult.value.success;
    const customerSuccess = customerResult.status === 'fulfilled' && customerResult.value.success;
    
    return {
      success: true, // 常に成功扱い（ログ記録されるため）
      adminResult: adminResult.status === 'fulfilled' ? adminResult.value : { success: false, error: adminResult.reason },
      customerResult: customerResult.status === 'fulfilled' ? customerResult.value : { success: false, error: customerResult.reason },
      details: {
        adminSent: adminSuccess,
        customerSent: customerSuccess,
        adminMethod: adminResult.value?.method || 'failed',
        customerMethod: customerResult.value?.method || 'failed'
      }
    };
  } catch (error) {
    console.error('❌ メール送信処理エラー:', error);
    return {
      success: true, // エラーでも予約は成功扱い
      error: error.message,
      fallback: 'logged_only'
    };
  }
};