import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCamera, FiSun, FiExternalLink } = FiIcons;

const Header = () => {
  return (
    <header className="bg-white shadow-lg relative z-50 border-b-4 border-orange-400">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <SafeIcon icon={FiCamera} className="text-3xl text-orange-600" />
              <SafeIcon icon={FiSun} className="text-lg text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">フォトスタジオハル</span>
              <div className="text-sm text-orange-600 font-semibold">夏フォトキャンペーン</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-600">キャンペーン期間</div>
              <div className="font-bold text-orange-600">8/1 〜 9/7</div>
            </div>
            <a
              href="https://photo.haru-hp.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full font-medium transition-colors text-sm inline-flex items-center space-x-1"
            >
              <SafeIcon icon={FiExternalLink} className="text-xs" />
              <span>スタジオハルのHP</span>
            </a>
            <Link
              to="/booking"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-colors shadow-lg"
            >
              今すぐ予約
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;