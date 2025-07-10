import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiUsers, FiHeart, FiBriefcase, FiClock, FiDollarSign } = FiIcons;

const Services = () => {
  const services = [
    {
      id: 1,
      name: 'ポートレート撮影',
      icon: FiUser,
      duration: 60,
      price: 15000,
      description: '個人のプロフィール写真や記念撮影に最適です。自然な表情を引き出すプロの技術で、あなたの魅力を最大限に表現します。',
      features: ['プロ照明使用', '衣装チェンジ可能', '写真データ20枚', 'レタッチ込み']
    },
    {
      id: 2,
      name: '家族写真',
      icon: FiUsers,
      duration: 90,
      price: 25000,
      description: 'ご家族の大切な時間を美しく残します。お子様から祖父母まで、みんなが自然に笑顔になれる撮影を心がけています。',
      features: ['家族全員撮影', '個人カットも含む', '写真データ30枚', '年賀状用データ提供']
    },
    {
      id: 3,
      name: 'カップル撮影',
      icon: FiHeart,
      duration: 120,
      price: 30000,
      description: '恋人同士や夫婦の特別な瞬間を撮影します。前撮りや記念日の撮影にも対応。二人だけの思い出を形に残しましょう。',
      features: ['衣装チェンジ2回', 'ロケーション撮影可能', '写真データ40枚', 'アルバム制作オプション']
    },
    {
      id: 4,
      name: 'ビジネスプロフィール',
      icon: FiBriefcase,
      duration: 45,
      price: 12000,
      description: 'プロフェッショナルなビジネス用写真を撮影します。LinkedIn、会社のWebサイト、名刺用など様々な用途に対応。',
      features: ['背景選択可能', 'スーツ着用推奨', '写真データ15枚', '当日仕上げ可能']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">撮影サービス</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            お客様のニーズに合わせた多様な撮影プランをご用意しています。
            プロフェッショナルな技術で、あなたの大切な瞬間を美しく残します。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <SafeIcon 
                    icon={service.icon} 
                    className="text-3xl text-blue-600 mr-3" 
                  />
                  <h2 className="text-2xl font-bold text-gray-800">{service.name}</h2>
                </div>

                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-gray-600">
                    <SafeIcon icon={FiClock} className="mr-2" />
                    <span>{service.duration}分</span>
                  </div>
                  <div className="flex items-center text-blue-600 font-bold text-xl">
                    <SafeIcon icon={FiDollarSign} className="mr-1" />
                    <span>¥{service.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">サービス内容</h3>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/booking"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                >
                  このサービスを予約する
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">共通サービス内容</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">撮影に含まれるもの</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• プロフォトグラファーによる撮影</li>
                <li>• スタジオ利用料</li>
                <li>• 基本照明セット</li>
                <li>• 写真データのオンライン納品</li>
                <li>• 基本的なレタッチ作業</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">オプションサービス</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 追加レタッチ: ¥1,000/枚</li>
                <li>• 写真プリント: ¥500/枚〜</li>
                <li>• アルバム制作: ¥15,000〜</li>
                <li>• 出張撮影: ¥10,000〜</li>
                <li>• 衣装レンタル: ¥3,000〜</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/booking"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              今すぐ予約する
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;