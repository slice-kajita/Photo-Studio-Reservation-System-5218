import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronLeft, FiChevronRight } = FiIcons;

const Calendar = ({ selectedDate, onDateSelect, campaignStart, campaignEnd }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7, 1)); // 8月から開始

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const today = new Date();
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  // お盆期間の定義
  const isOBonPeriod = (date) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
    const obonStart = new Date(2025, 7, 11); // 8月11日
    const obonEnd = new Date(2025, 7, 16); // 8月16日
    return checkDate >= obonStart && checkDate <= obonEnd;
  };

  const isDateInCampaign = (date) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
    return checkDate >= campaignStart && checkDate <= campaignEnd;
  };

  const isDateAvailable = (date) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
    return checkDate >= today && isDateInCampaign(date) && !isOBonPeriod(date);
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
    return checkDate.toDateString() === selectedDate.toDateString();
  };

  const isWeekend = (date) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
    return checkDate.getDay() === 0 || checkDate.getDay() === 6;
  };

  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
    onDateSelect(newDate);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 sm:h-16"></div>);
    }

    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const isAvailable = isDateAvailable(date);
      const isSelected = isDateSelected(date);
      const isWeekendDay = isWeekend(date);
      const inCampaign = isDateInCampaign(date);
      const isOBon = isOBonPeriod(date);

      days.push(
        <motion.button
          key={date}
          whileHover={isAvailable ? { scale: 1.05 } : {}}
          whileTap={isAvailable ? { scale: 0.95 } : {}}
          onClick={() => handleDateClick(date)}
          disabled={!isAvailable}
          className={`h-12 sm:h-16 w-full rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
            isSelected
              ? 'bg-orange-500 text-white shadow-lg'
              : isAvailable
              ? isWeekendDay
                ? 'bg-red-50 border-2 border-red-200 hover:border-red-400 text-red-700'
                : 'bg-blue-50 border-2 border-blue-200 hover:border-blue-400 text-blue-700'
              : isOBon
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
              : inCampaign
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          }`}
        >
          <div className="text-xs sm:text-sm">{date}</div>
          {isOBon ? (
            <div className="text-xs mt-0.5 sm:mt-1 text-red-500">休業</div>
          ) : isAvailable ? (
            <div className="text-xs mt-0.5 sm:mt-1 leading-none">
              ¥{isWeekendDay ? '7,700' : '5,500'}
            </div>
          ) : null}
        </motion.button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 border border-orange-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
          disabled={currentMonth.getMonth() < 7 || currentMonth.getFullYear() < 2025}
        >
          <SafeIcon icon={FiChevronLeft} className="text-lg sm:text-xl text-orange-600" />
        </button>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
        </h3>

        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
          disabled={currentMonth.getMonth() > 8 || currentMonth.getFullYear() > 2025}
        >
          <SafeIcon icon={FiChevronRight} className="text-lg sm:text-xl text-orange-600" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`h-6 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium ${
              index === 0 || index === 6 ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 space-y-2 text-xs sm:text-sm">
        <div className="flex items-center justify-center space-x-4 sm:space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-200 rounded mr-2"></div>
            <span className="text-xs sm:text-sm">平日 ¥5,500</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-200 rounded mr-2"></div>
            <span className="text-xs sm:text-sm">休日 ¥7,700</span>
          </div>
        </div>
        <p className="text-center text-gray-600 text-xs sm:text-sm leading-relaxed">
          ※ キャンペーン期間：8月1日〜9月7日<br />
          ※ お盆期間（8/11〜8/16）は休業いたします
        </p>
      </div>
    </div>
  );
};

export default Calendar;