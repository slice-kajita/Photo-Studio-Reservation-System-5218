import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { getAllBookings, updateBookingStatus, deleteBooking, getEmailNotifications, testDatabaseConnection } from '../services/bookingService';

const { FiUser, FiCalendar, FiPhone, FiMail, FiEdit, FiTrash2, FiLogOut, FiRefreshCw, FiMessageCircle, FiAlertTriangle, FiDatabase, FiCheckCircle, FiXCircle } = FiIcons;

const Admin = ({ onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    initializeAdmin();
  }, []);

  const initializeAdmin = async () => {
    // Test database connection first
    console.log('🔧 管理画面初期化開始...');
    const dbTest = await testDatabaseConnection();
    setDbStatus(dbTest);
    console.log('📊 データベーステスト結果:', dbTest);
    
    if (dbTest.success) {
      fetchBookings();
    } else {
      console.error('❌ データベース接続失敗:', dbTest);
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      console.log('🔄 予約データ取得開始...');
      const data = await getAllBookings();
      console.log('📊 取得した予約数:', data.length);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
      alert('予約データの取得に失敗しました: ' + error.message);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!bookingId || !newStatus) {
      alert('無効な操作です');
      return;
    }

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      alert('予約が見つかりません');
      return;
    }

    const confirmMessage = `ステータスを「${getStatusText(newStatus)}」に変更しますか？\n\n【対象予約】\nお名前: ${booking.name}\n撮影日: ${new Date(booking.booking_date).toLocaleDateString('ja-JP')}`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setStatusLoading(bookingId);
    
    try {
      console.log('🔄 ステータス更新開始:', { bookingId, newStatus });
      const result = await updateBookingStatus(bookingId, newStatus);
      
      if (result.success) {
        console.log('✅ ステータス更新成功');
        await fetchBookings(); // Refresh the data
        setSelectedBooking(null);
        alert(`ステータスを「${getStatusText(newStatus)}」に更新しました`);
      } else {
        console.error('❌ ステータス更新失敗:', result.error);
        alert('ステータスの更新に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('❌ ステータス更新エラー:', error);
      alert('ステータスの更新に失敗しました: ' + error.message);
    } finally {
      setStatusLoading(null);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!bookingId) {
      alert('無効な操作です');
      return;
    }

    // 確認ダイアログを表示
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      alert('予約が見つかりません');
      return;
    }

    const confirmMessage = `予約を完全に削除しますか？\n\n【削除される予約】\nお名前: ${booking.name}\nメール: ${booking.email}\n撮影日: ${new Date(booking.booking_date).toLocaleDateString('ja-JP')}\n時間: ${booking.booking_time}\n\n⚠️ この操作は取り消せません！`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    // 二重確認
    if (!window.confirm('本当に削除しますか？この操作は取り消せません。')) {
      return;
    }

    setDeleteLoading(bookingId);
    
    try {
      console.log('🗑️ 予約削除開始:', bookingId);
      const result = await deleteBooking(bookingId);
      
      if (result.success) {
        console.log('✅ 予約削除成功');
        await fetchBookings(); // Refresh the data
        setSelectedBooking(null);
        alert('予約を削除しました');
      } else {
        console.error('❌ 削除失敗:', result.error);
        alert('予約の削除に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('❌ 削除エラー:', error);
      alert('予約の削除に失敗しました: ' + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewDetails = async (booking) => {
    setSelectedBooking(booking);
    try {
      const notifications = await getEmailNotifications(booking.id);
      setEmailNotifications(notifications);
    } catch (error) {
      console.error('Error fetching email notifications:', error);
      setEmailNotifications([]);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return '確定';
      case 'cancelled': return 'キャンセル';
      case 'completed': return '完了';
      default: return status || '未設定';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
          {dbStatus && !dbStatus.success && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-semibold">データベース接続エラー</p>
              <p className="text-red-500 text-sm">{dbStatus.error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">管理画面</h1>
              <p className="text-sm text-orange-600">フォトスタジオハル - 夏フォトキャンペーン</p>
              
              {/* Enhanced Database Status */}
              {dbStatus && (
                <div className="mt-2 flex items-center space-x-4 text-xs">
                  <div className={`flex items-center ${dbStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                    <SafeIcon icon={dbStatus.success ? FiCheckCircle : FiXCircle} className="mr-1" />
                    <span>DB接続: {dbStatus.success ? '正常' : 'エラー'}</span>
                  </div>
                  
                  {dbStatus.success && (
                    <>
                      <div className={`flex items-center ${dbStatus.readAccess ? 'text-green-600' : 'text-red-600'}`}>
                        <SafeIcon icon={dbStatus.readAccess ? FiCheckCircle : FiXCircle} className="mr-1" />
                        <span>読取: {dbStatus.readAccess ? 'OK' : 'NG'}</span>
                      </div>
                      <div className={`flex items-center ${dbStatus.writeAccess ? 'text-green-600' : 'text-yellow-600'}`}>
                        <SafeIcon icon={dbStatus.writeAccess ? FiCheckCircle : FiAlertTriangle} className="mr-1" />
                        <span>更新: {dbStatus.writeAccess ? 'OK' : '制限'}</span>
                      </div>
                      <div className={`flex items-center ${dbStatus.deleteAccess ? 'text-green-600' : 'text-yellow-600'}`}>
                        <SafeIcon icon={dbStatus.deleteAccess ? FiCheckCircle : FiAlertTriangle} className="mr-1" />
                        <span>削除: {dbStatus.deleteAccess ? 'OK' : '制限'}</span>
                      </div>
                      <span className="text-gray-500">
                        レコード数: {dbStatus.recordCount || 0}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <SafeIcon icon={FiRefreshCw} className={loading ? 'animate-spin' : ''} />
                <span>更新</span>
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiLogOut} />
                <span>ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Database Status Alert */}
        {dbStatus && !dbStatus.success && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <SafeIcon icon={FiAlertTriangle} className="text-red-500 mr-2" />
              <div>
                <h3 className="font-semibold text-red-800">データベース接続エラー</h3>
                <p className="text-sm text-red-700">{dbStatus.error}</p>
                {dbStatus.details && (
                  <p className="text-xs text-red-600 mt-1">詳細: {dbStatus.details}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Permission Warnings */}
        {dbStatus && dbStatus.success && (!dbStatus.writeAccess || !dbStatus.deleteAccess) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <SafeIcon icon={FiAlertTriangle} className="text-yellow-500 mr-2" />
              <div>
                <h3 className="font-semibold text-yellow-800">権限制限のお知らせ</h3>
                <div className="text-sm text-yellow-700 mt-1">
                  {!dbStatus.writeAccess && <p>• ステータス更新機能が制限されています</p>}
                  {!dbStatus.deleteAccess && <p>• 削除機能が制限されています</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-sm text-gray-600">総予約数</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">確定済み</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'cancelled').length}
            </div>
            <div className="text-sm text-gray-600">キャンセル</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-2xl font-bold text-purple-600">
              ¥{bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.total_price || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">総売上</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'すべて' },
              { value: 'confirmed', label: '確定済み' },
              { value: 'cancelled', label: 'キャンセル' },
              { value: 'completed', label: '完了' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">お客様</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">撮影日時</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">連絡先</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">料金</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ステータス</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <SafeIcon icon={FiUser} className="text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{booking.name}</div>
                          <div className="text-sm text-gray-500">{booking.participants}名</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <SafeIcon icon={FiCalendar} className="text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(booking.booking_date).toLocaleDateString('ja-JP')}
                          </div>
                          <div className="text-sm text-gray-500">{booking.booking_time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <SafeIcon icon={FiPhone} className="text-gray-400 mr-2" />
                          <span>{booking.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <SafeIcon icon={FiMail} className="text-gray-400 mr-2" />
                          <span className="text-xs">{booking.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        ¥{(booking.total_price || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.is_weekend ? '休日' : '平日'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-blue-600 hover:text-blue-800"
                          title="詳細表示"
                        >
                          <SafeIcon icon={FiEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          disabled={deleteLoading === booking.id || (dbStatus && !dbStatus.deleteAccess)}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={dbStatus && !dbStatus.deleteAccess ? "削除権限が制限されています" : "削除"}
                        >
                          {deleteLoading === booking.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <SafeIcon icon={FiTrash2} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">該当する予約がありません</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">予約詳細編集</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                <p className="text-gray-900">{selectedBooking.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">撮影日時</label>
                <p className="text-gray-900">
                  {new Date(selectedBooking.booking_date).toLocaleDateString('ja-JP')} {selectedBooking.booking_time}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">連絡先</label>
                <p className="text-gray-900">{selectedBooking.phone}</p>
                <p className="text-sm text-gray-600">{selectedBooking.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">参加人数</label>
                <p className="text-gray-900">{selectedBooking.participants}人</p>
              </div>
              {selectedBooking.child_age && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">お子様の年齢</label>
                  <p className="text-gray-900">{selectedBooking.child_age}</p>
                </div>
              )}
              {selectedBooking.requests && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ご要望</label>
                  <p className="text-gray-900">{selectedBooking.requests}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">料金</label>
                <p className="text-gray-900">¥{(selectedBooking.total_price || 0).toLocaleString()}</p>
              </div>

              {/* Email Notifications */}
              {emailNotifications.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <SafeIcon icon={FiMessageCircle} className="mr-2" />
                    送信済みメール
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {emailNotifications.map((notification) => (
                      <div key={notification.id} className="flex justify-between items-center text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          notification.email_type === 'admin_notification' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {notification.email_type === 'admin_notification' ? '管理者通知' : 'お客様確認'}
                        </span>
                        <span className="text-gray-600">
                          {new Date(notification.sent_at).toLocaleString('ja-JP')}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          notification.status === 'sent' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {notification.status === 'sent' ? '送信済' : '送信失敗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">ステータス変更</label>
              {dbStatus && !dbStatus.writeAccess && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                  <p className="text-yellow-700 text-sm">⚠️ ステータス変更権限が制限されています</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                  disabled={statusLoading === selectedBooking.id || (dbStatus && !dbStatus.writeAccess)}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  {statusLoading === selectedBooking.id && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  )}
                  <span>確定</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                  disabled={statusLoading === selectedBooking.id || (dbStatus && !dbStatus.writeAccess)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  {statusLoading === selectedBooking.id && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  )}
                  <span>キャンセル</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                  disabled={statusLoading === selectedBooking.id || (dbStatus && !dbStatus.writeAccess)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  {statusLoading === selectedBooking.id && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  )}
                  <span>完了</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                <SafeIcon icon={FiAlertTriangle} className="text-red-500 mr-2" />
                <span className="text-sm text-red-700">削除は取り消せません</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  閉じる
                </button>
                <button
                  onClick={() => handleDelete(selectedBooking.id)}
                  disabled={deleteLoading === selectedBooking.id || (dbStatus && !dbStatus.deleteAccess)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {deleteLoading === selectedBooking.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>削除中...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiTrash2} />
                      <span>{dbStatus && !dbStatus.deleteAccess ? '削除制限中' : '削除'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;