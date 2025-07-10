import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Calendar from '../components/Calendar';
import TimeSlots from '../components/TimeSlots';
import BookingForm from '../components/BookingForm';
import { createBooking } from '../services/bookingService';

const { FiCalendar, FiClock, FiUser } = FiIcons;

const Booking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBookingSubmit = async (formData) => {
    setLoading(true);
    
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    const basePrice = isWeekend ? 7700 : 5500;

    const bookingData = {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      isWeekend: isWeekend,
      basePrice: basePrice,
      totalPrice: basePrice,
      campaignType: '夏フォトキャンペーン'
    };

    const result = await createBooking(bookingData);
    
    if (result.success) {
      navigate('/confirmation', { state: { booking: { ...bookingData, id: result.booking.id } } });
    } else {
      alert('予約の作成に失敗しました。もう一度お試しください。');
    }
    
    setLoading(false);
  };

  const steps = [
    { number: 1, title: '日時選択', icon: FiCalendar },
    { number: 2, title: '時間選択', icon: FiClock },
    { number: 3, title: '詳細入力', icon: FiUser }
  ];

  const getPriceForDate = (date) => {
    if (!date) return 0;
    return date.getDay() === 0 || date.getDay() === 6 ? 7700 : 5500;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">夏フォトキャンペーン予約</h1>
          <p className="text-orange-600 font-semibold">期間限定：8月1日〜9月7日</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepItem.number 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  <SafeIcon icon={stepItem.icon} className="text-sm" />
                </div>
                <span className="ml-2 text-sm font-medium hidden md:block">
                  {stepItem.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Price Display */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg p-4 mb-6 text-center"
          >
            <div className="flex items-center justify-center space-x-4">
              <div>
                <div className="text-2xl font-bold">¥{getPriceForDate(selectedDate).toLocaleString()}</div>
                <div className="text-sm opacity-90">
                  {selectedDate.getDay() === 0 || selectedDate.getDay() === 6 ? '休日料金' : '平日料金'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          {/* Step 1: Date Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">撮影日を選択してください</h2>
              <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center mb-2">
                  <SafeIcon icon={FiCalendar} className="text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800">料金表</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>平日（月〜金）: ¥5,500</div>
                  <div>休日（土・日・祝）: ¥7,700</div>
                </div>
              </div>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                campaignStart={new Date(2025, 7, 1)} // 8月1日
                campaignEnd={new Date(2025, 8, 7)}   // 9月7日
              />
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedDate}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                >
                  次へ
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">撮影時間を選択してください</h2>
              <TimeSlots
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
                selectedDate={selectedDate}
              />
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedTime}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                >
                  次へ
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Booking Form */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">お客様情報を入力してください</h2>
              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p>予約を作成中...</p>
                  </div>
                </div>
              )}
              <BookingForm
                onSubmit={handleBookingSubmit}
                onBack={() => setStep(2)}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                basePrice={getPriceForDate(selectedDate)}
                disabled={loading}
              />
            </div>
          )}
        </motion.div>

        {/* Footer Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ※価格は税込表記です。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;