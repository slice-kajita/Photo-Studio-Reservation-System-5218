import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiMinus } = FiIcons;

const BookingForm = ({ onSubmit, onBack, selectedDate, selectedTime, basePrice }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    childAge: '',
    requests: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号を入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const totalPrice = basePrice;
  const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;

  return (
    <div>
      {/* Booking Summary */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 mb-6 border border-orange-200">
        <h3 className="font-semibold text-lg mb-4 text-orange-800">予約内容確認</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">日時:</span>
            <span>{formatDate(selectedDate)} {selectedTime}〜</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">料金:</span>
            <span>¥{basePrice.toLocaleString()} ({isWeekend ? '休日' : '平日'})</span>
          </div>
          <div className="border-t border-orange-200 pt-2 mt-2 flex justify-between font-bold text-lg text-orange-700">
            <span>合計:</span>
            <span>¥{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="山田 太郎"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="090-1234-5678"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              参加人数
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, participants: Math.max(1, prev.participants - 1) }))}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <SafeIcon icon={FiMinus} className="text-sm" />
              </button>
              <span className="text-lg font-semibold w-12 text-center">{formData.participants}人</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, participants: Math.min(10, prev.participants + 1) }))}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <SafeIcon icon={FiPlus} className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            お子様の年齢（お子様がいらっしゃる場合）
          </label>
          <input
            type="text"
            name="childAge"
            value={formData.childAge}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="例：3歳、1歳と5歳"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ご要望・備考
          </label>
          <textarea
            name="requests"
            value={formData.requests}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="撮影に関するご要望や特別なリクエストがあればお書きください"
          />
        </div>

        {/* メール送信に関する注意書き */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📧 メール送信について</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 予約完了後、確認メールをお送りします</li>
            <li>• メールが届かない場合は、迷惑メールフォルダをご確認ください</li>
            <li>• メールが届かない場合は、お電話でご連絡いたします</li>
            <li>• 管理者にも同時に通知が送信されます</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
          >
            戻る
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-colors font-semibold shadow-lg"
          >
            予約を確定する
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;