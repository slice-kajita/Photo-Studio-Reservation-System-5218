import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBookedSlots } from '../services/bookingService';

const TimeSlots = ({ selectedTime, onTimeSelect, selectedDate }) => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // 午前・午後の時間枠を追加
  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDate]);

  const fetchBookedSlots = async () => {
    setLoading(true);
    const slots = await getBookedSlots(selectedDate);
    setBookedSlots(slots);
    setLoading(false);
  };

  const isSlotAvailable = (time) => {
    return !bookedSlots.includes(time);
  };

  const getEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + 20, 0, 0);
    return endDate.toTimeString().slice(0, 5);
  };

  const getTimeCategory = (time) => {
    const hour = parseInt(time.split(':')[0]);
    return hour < 13 ? 'morning' : 'afternoon';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-orange-200">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">時間枠を確認中...</p>
        </div>
      </div>
    );
  }

  const morningSlots = timeSlots.filter(time => getTimeCategory(time) === 'morning');
  const afternoonSlots = timeSlots.filter(time => getTimeCategory(time) === 'afternoon');

  return (
    <div className="bg-white rounded-lg p-6 border border-orange-200">
      <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <h3 className="font-semibold text-orange-800 mb-2">撮影について</h3>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• 撮影時間：20分</li>
          <li>• お渡し：厳選1カットのデジタルデータ</li>
          <li>• 撮影後1週間以内にメールでお渡し</li>
        </ul>
      </div>

      <h3 className="text-lg font-semibold mb-4">利用可能な時間帯</h3>
      
      {/* 午前の時間帯 */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3 text-blue-600">午前（10:00〜12:00）</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {morningSlots.map((time) => {
            const isAvailable = isSlotAvailable(time);
            const isSelected = selectedTime === time;
            const endTime = getEndTime(time);

            return (
              <motion.button
                key={time}
                whileHover={isAvailable ? { scale: 1.02 } : {}}
                whileTap={isAvailable ? { scale: 0.98 } : {}}
                onClick={() => isAvailable && onTimeSelect(time)}
                disabled={!isAvailable}
                className={`p-3 rounded-lg text-center transition-colors ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-lg'
                    : isAvailable
                    ? 'bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100'
                }`}
              >
                <div className="font-semibold">{time}</div>
                <div className="text-xs opacity-75">〜{endTime}</div>
                {!isAvailable && (
                  <div className="text-xs text-red-500 mt-1">予約済</div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 午後の時間帯 */}
      <div>
        <h4 className="text-md font-medium mb-3 text-green-600">午後（13:00〜17:00）</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {afternoonSlots.map((time) => {
            const isAvailable = isSlotAvailable(time);
            const isSelected = selectedTime === time;
            const endTime = getEndTime(time);

            return (
              <motion.button
                key={time}
                whileHover={isAvailable ? { scale: 1.02 } : {}}
                whileTap={isAvailable ? { scale: 0.98 } : {}}
                onClick={() => isAvailable && onTimeSelect(time)}
                disabled={!isAvailable}
                className={`p-3 rounded-lg text-center transition-colors ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-lg'
                    : isAvailable
                    ? 'bg-white border-2 border-green-200 hover:border-green-400 hover:bg-green-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100'
                }`}
              >
                <div className="font-semibold">{time}</div>
                <div className="text-xs opacity-75">〜{endTime}</div>
                {!isAvailable && (
                  <div className="text-xs text-red-500 mt-1">予約済</div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>各時間枠20分間の撮影となります</p>
        <p className="text-xs mt-1">※ 12:00〜13:00は休憩時間のため予約できません</p>
      </div>
    </div>
  );
};

export default TimeSlots;