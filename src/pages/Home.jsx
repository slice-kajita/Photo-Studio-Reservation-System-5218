import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCalendar, FiClock, FiImage, FiHeart, FiStar, FiGift, FiExternalLink, FiPhone, FiMapPin } = FiIcons;

const Home = () => {
  const features = [
    {
      icon: FiClock,
      title: '撮影時間 一組20分',
      description: '完全予約制でじっくり撮影'
    },
    {
      icon: FiImage,
      title: 'データ１カット',
      description: 'お好きなカットをセレクト可能'
    },
    {
      icon: FiGift,
      title: '限定価格',
      description: '平日¥5,500 / 休日¥7,700'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Image Section - Full width photo without overlay */}
      <section className="relative">
        <div className="w-full">
          <img 
            src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751415125347-%C3%A3%C2%82%C2%B9%C3%A3%C2%82%C2%AF%C3%A3%C2%83%C2%AA%C3%A3%C2%83%C2%BC%C3%A3%C2%83%C2%B3%C3%A3%C2%82%C2%B7%C3%A3%C2%83%C2%A7%C3%A3%C2%83%C2%83%C3%A3%C2%83%C2%88%202025-07-01%2020.58.12.jpg"
            alt="フォトスタジオハルで撮影されたファミリーフォトのサンプル"
            className="w-full h-[60vh] md:h-[70vh] object-cover"
          />
        </div>
      </section>

      {/* Campaign Section with Gradient */}
      <section className="relative py-20 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 via-yellow-500/80 to-orange-500/90"></div>

        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <SafeIcon icon={FiStar} className="text-yellow-300 mr-2" />
              <span className="font-semibold">期間限定キャンペーン開催中</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              夏フォト<br />キャンペーン
            </h1>
            
            <p className="text-xl md:text-2xl mb-2 font-semibold drop-shadow-md">
              8月1日〜9月7日限定
            </p>
            <p className="text-sm md:text-base mb-4 bg-red-500 bg-opacity-90 rounded-full px-4 py-2 inline-block">
              ※お盆期間（8/11〜8/16）は休業いたします
            </p>
            
            <div className="bg-white bg-opacity-95 text-gray-800 rounded-lg p-6 max-w-lg mx-auto mb-8 backdrop-blur-sm shadow-xl">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">¥5,500</div>
                  <div className="text-sm">平日</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">¥7,700</div>
                  <div className="text-sm">休日</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                撮影時間20分 + お気に入り1カットお渡し
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                to="/booking"
                className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 shadow-xl drop-shadow-lg"
              >
                <SafeIcon icon={FiCalendar} />
                <span>今すぐ予約する</span>
              </Link>
              
              <a
                href="https://photo.haru-hp.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-10 text-white border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors inline-flex items-center space-x-2 backdrop-blur-sm"
              >
                <SafeIcon icon={FiExternalLink} />
                <span>スタジオハルのHPはこちら</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Studio Logo Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751450976147-logo.png"
              alt="フォトスタジオハル ロゴ"
              className="h-28 md:h-36 mx-auto mb-6 object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* Campaign Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">キャンペーン内容</h2>
            <p className="text-xl text-gray-600">
              この夏の思い出を、ポップな元気あふれる写真で残しませんか？
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200"
              >
                <SafeIcon 
                  icon={feature.icon} 
                  className="text-4xl text-orange-600 mx-auto mb-4" 
                />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">🏃‍♀️ 残り期間わずか！</h2>
            <p className="text-xl mb-2">
              夏の思い出を残すチャンスは9月7日まで！
            </p>
            <p className="text-sm mb-6 bg-white bg-opacity-20 rounded-full px-4 py-2 inline-block">
              ※お盆期間（8/11〜8/16）は休業
            </p>
            <Link
              to="/booking"
              className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-block shadow-lg"
            >
              空き状況を確認する
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">よくあるご質問</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg mb-2 text-orange-600">平日と休日の違いは？</h3>
                <p className="text-gray-600 text-sm">
                  平日（月〜金）は¥5,500、休日（土日祝）は¥7,700となります。撮影内容は同じです。
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg mb-2 text-orange-600">何歳から撮影できますか？</h3>
                <p className="text-gray-600 text-sm">
                  0歳の赤ちゃんから撮影可能です。ご家族みなさまでお越しください。
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg mb-2 text-orange-600">データはいつもらえますか？</h3>
                <p className="text-gray-600 text-sm">
                  撮影から1週間以内にメールでお渡しします。お急ぎの場合はご相談ください。
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg mb-2 text-orange-600">お盆期間中の営業は？</h3>
                <p className="text-gray-600 text-sm">
                  申し訳ございませんが、8月11日〜8月16日は休業いたします。ご了承ください。
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">アクセス・お問い合わせ</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-8 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-600 mb-6">フォトスタジオハル</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiPhone} className="text-xl text-orange-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">電話番号</p>
                      <a 
                        href="tel:022-796-6733" 
                        className="text-lg text-blue-600 hover:text-blue-800 font-medium"
                      >
                        022-796-6733
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiMapPin} className="text-xl text-orange-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">住所</p>
                      <p className="text-gray-700">
                        仙台市太白区富沢１丁目12-8
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        地下鉄富沢駅より徒歩8分<br />
                        仙台市体育館の近く
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <SafeIcon icon={FiMapPin} className="text-5xl mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2">アクセス</h4>
                  <p className="text-sm">地下鉄富沢駅より徒歩8分</p>
                  <p className="text-sm">仙台市体育館の近く</p>
                  <div className="mt-4">
                    <a
                      href="https://photo.haru-hp.jp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-orange-600 hover:text-orange-800 font-medium"
                    >
                      <SafeIcon icon={FiExternalLink} className="text-sm" />
                      <span>詳しいアクセスはHPで</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Notice */}
      <footer className="py-8 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            ※価格は税込表記です。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;