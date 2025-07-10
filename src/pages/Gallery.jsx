import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCamera, FiUser, FiUsers, FiHeart, FiBriefcase } = FiIcons;

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'すべて', icon: FiCamera },
    { id: 'portrait', name: 'ポートレート', icon: FiUser },
    { id: 'family', name: '家族写真', icon: FiUsers },
    { id: 'couple', name: 'カップル', icon: FiHeart },
    { id: 'business', name: 'ビジネス', icon: FiBriefcase }
  ];

  const galleryItems = [
    { id: 1, category: 'portrait', title: 'ポートレート作品1' },
    { id: 2, category: 'family', title: '家族写真作品1' },
    { id: 3, category: 'couple', title: 'カップル作品1' },
    { id: 4, category: 'business', title: 'ビジネス作品1' },
    { id: 5, category: 'portrait', title: 'ポートレート作品2' },
    { id: 6, category: 'family', title: '家族写真作品2' },
    { id: 7, category: 'couple', title: 'カップル作品2' },
    { id: 8, category: 'business', title: 'ビジネス作品2' },
    { id: 9, category: 'portrait', title: 'ポートレート作品3' },
    { id: 10, category: 'family', title: '家族写真作品3' },
    { id: 11, category: 'couple', title: 'カップル作品3' },
    { id: 12, category: 'business', title: 'ビジネス作品3' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      portrait: 'from-blue-400 to-blue-600',
      family: 'from-green-400 to-green-600',
      couple: 'from-pink-400 to-pink-600',
      business: 'from-gray-400 to-gray-600'
    };
    return colors[category] || 'from-purple-400 to-purple-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">作品ギャラリー</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            これまでに撮影させていただいた作品の一部をご紹介します。
            お客様の大切な瞬間を美しく残すことが私たちの使命です。
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              <SafeIcon icon={category.icon} />
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <div 
                  className={`w-full h-full bg-gradient-to-br ${getCategoryColor(item.category)} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <SafeIcon icon={FiCamera} className="text-4xl text-white opacity-80" />
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="w-full p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm opacity-90">
                      {categories.find(cat => cat.id === item.category)?.name}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">該当する作品がありません</p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            あなたも素敵な写真を撮影しませんか？
          </h2>
          <p className="text-gray-600 mb-6">
            プロフェッショナルな技術で、あなたの大切な瞬間を美しく残します
          </p>
          <motion.a
            href="#/booking"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            撮影を予約する
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;