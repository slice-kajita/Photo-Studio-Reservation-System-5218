import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheckCircle, FiCalendar, FiSun, FiExternalLink } = FiIcons;

const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">予約情報が見つかりません</p>
          <Link to="/booking" className="text-orange-600 hover:text-orange-800">
            予約ページに戻る
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <div className="mb-6">
            <SafeIcon icon={FiCheckCircle} className="text-6xl text-green-500 mx-auto mb-4" />
            <SafeIcon icon={FiSun} className="text-4xl text-yellow-500 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            予約が完了しました！
          </h1>

          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg p-4 mb-6">
            <h2 className="font-bold text-lg">夏フォトキャンペーン</h2>
            <p className="text-sm opacity-90">ご予約ありがとうございます</p>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
              <SafeIcon icon={FiCalendar} className="mr-2" />
              予約詳細
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">撮影日時:</span>
                <span>{formatDate(booking.date)} {booking.time}〜</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">撮影時間:</span>
                <span>20分</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">参加人数:</span>
                <span>{booking.participants}人</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-orange-600">
                <span>料金:</span>
                <span>¥{booking.totalPrice.toLocaleString()} ({booking.isWeekend ? '休日' : '平日'})</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-semibold mb-4">お客様情報</h2>
            <div className="space-y-2">
              <p><span className="font-medium">お名前:</span> {booking.name}</p>
              <p><span className="font-medium">メール:</span> {booking.email}</p>
              <p><span className="font-medium">電話:</span> {booking.phone}</p>
              {booking.childAge && (
                <p><span className="font-medium">お子様の年齢:</span> {booking.childAge}</p>
              )}
              {booking.requests && (
                <p><span className="font-medium">ご要望:</span> {booking.requests}</p>
              )}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
              <SafeIcon icon={FiSun} className="mr-2" />
              重要なお知らせ
            </h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• 撮影時刻の10分前にお越しください</li>
              <li>• 撮影時間は20分間です</li>
              <li>• お気に入り1カットを厳選してお渡しします</li>
              <li>• 撮影データは1週間以内にメールでお渡し</li>
              <li>• キャンセルは前日までにお電話でご連絡ください</li>
              <li>• 夏らしい明るい衣装がおすすめです</li>
              <li>• お盆期間（8/11〜8/16）は休業いたします</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2">フォトスタジオハル</h3>
            <p className="text-sm text-orange-700">
              ご不明な点がございましたら、お気軽にお問い合わせください
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-colors font-semibold"
            >
              トップページに戻る
            </Link>
            <a
              href="https://photo.haru-hp.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold inline-flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiExternalLink} />
              <span>スタジオハルのHPはこちら</span>
            </a>
          </div>

          {/* Footer Notice */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ※価格は税込表記です。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;