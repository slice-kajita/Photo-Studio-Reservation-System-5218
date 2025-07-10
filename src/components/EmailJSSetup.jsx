import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMail, FiSettings, FiCheck, FiAlertCircle, FiExternalLink } = FiIcons;

const EmailJSSetup = () => {
  const [config, setConfig] = useState({
    publicKey: '',
    serviceId: '',
    adminTemplateId: '',
    customerTemplateId: ''
  });
  
  const [isConfigured, setIsConfigured] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleConfigSave = () => {
    // 設定を保存（実際の実装では環境変数やconfigファイルに保存）
    console.log('EmailJS設定保存:', config);
    setIsConfigured(true);
    
    // 実際の設定ファイルを更新する場合
    // updateEmailJSConfig(config);
  };

  const setupInstructions = [
    {
      step: 1,
      title: 'EmailJSでサービスを作成',
      description: 'EmailJSダッシュボードでメールサービス（Gmail、Outlook等）を設定',
      details: [
        'EmailJSダッシュボードにログイン',
        '「Email Services」→「Add New Service」',
        'Gmail または Outlook を選択',
        '認証設定を完了'
      ]
    },
    {
      step: 2,
      title: 'メールテンプレートを作成',
      description: '管理者通知用とお客様確認用の2つのテンプレートを作成',
      details: [
        '「Email Templates」→「Create New Template」',
        '管理者通知用テンプレート作成',
        'お客様確認用テンプレート作成',
        '各テンプレートIDをコピー'
      ]
    },
    {
      step: 3,
      title: '設定情報を取得',
      description: 'Public Key、Service ID、Template IDを取得',
      details: [
        'Account設定からPublic Keyを取得',
        'Email ServicesからService IDを取得',
        'Email TemplatesからTemplate IDを取得',
        '下記フォームに入力'
      ]
    }
  ];

  const templateExamples = {
    admin: `
件名: 【新規予約】{{customer_name}}様 - {{booking_date}} {{booking_time}}

新しい予約が入りました。

【予約詳細】
お名前: {{customer_name}}
メール: {{customer_email}}
電話番号: {{customer_phone}}
撮影日: {{booking_date}}
撮影時間: {{booking_time}}〜
参加人数: {{participants}}人
料金: ¥{{total_price}} ({{price_type}})
お子様の年齢: {{child_age}}
ご要望: {{requests}}
予約ID: {{booking_id}}

お客様への確認連絡をお忘れなく！
    `,
    customer: `
件名: 【予約確認】夏フォトキャンペーン - ご予約ありがとうございます

{{customer_name}} 様

この度は、フォトスタジオハルの夏フォトキャンペーンにお申し込みいただき、誠にありがとうございます。
以下の内容でご予約を承りました。

【ご予約内容】
撮影日: {{booking_date}}
撮影時間: {{booking_time}}〜（20分間）
参加人数: {{participants}}人
料金: ¥{{total_price}} ({{price_type}})
お子様の年齢: {{child_age}}
ご要望: {{requests}}

【撮影当日について】
• 撮影開始時刻の10分前にお越しください
• 撮影時間は20分間です
• お気に入り1カットを厳選してお渡しします
• 撮影データは1週間以内にメールでお渡し
• 夏らしい明るい衣装がおすすめです

【スタジオ情報】
住所: {{studio_address}}
電話: {{studio_phone}}
地下鉄富沢駅より徒歩8分・仙台市体育館の近く

フォトスタジオハル
    `
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <SafeIcon icon={FiMail} className="text-4xl text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">EmailJS設定</h1>
        <p className="text-gray-600">メール送信機能を設定します</p>
      </div>

      {/* 設定状態表示 */}
      <div className={`mb-6 p-4 rounded-lg ${isConfigured ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border`}>
        <div className="flex items-center">
          <SafeIcon icon={isConfigured ? FiCheck : FiAlertCircle} className={`mr-2 ${isConfigured ? 'text-green-600' : 'text-yellow-600'}`} />
          <span className={`font-medium ${isConfigured ? 'text-green-800' : 'text-yellow-800'}`}>
            {isConfigured ? 'EmailJS設定完了' : 'EmailJS設定が必要です'}
          </span>
        </div>
      </div>

      {/* 設定手順 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">設定手順</h2>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showInstructions ? '手順を隠す' : '手順を表示'}
          </button>
        </div>

        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-6"
          >
            {setupInstructions.map((instruction) => (
              <div key={instruction.step} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  ステップ {instruction.step}: {instruction.title}
                </h3>
                <p className="text-gray-600 mb-2">{instruction.description}</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {instruction.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 設定フォーム */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">設定情報入力</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Public Key
            </label>
            <input
              type="text"
              value={config.publicKey}
              onChange={(e) => setConfig({...config, publicKey: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user_xxxxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service ID
            </label>
            <input
              type="text"
              value={config.serviceId}
              onChange={(e) => setConfig({...config, serviceId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="service_xxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              管理者通知テンプレートID
            </label>
            <input
              type="text"
              value={config.adminTemplateId}
              onChange={(e) => setConfig({...config, adminTemplateId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="template_xxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              お客様確認テンプレートID
            </label>
            <input
              type="text"
              value={config.customerTemplateId}
              onChange={(e) => setConfig({...config, customerTemplateId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="template_xxxxxxxx"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleConfigSave}
            disabled={!config.publicKey || !config.serviceId || !config.adminTemplateId || !config.customerTemplateId}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            設定を保存
          </button>
        </div>
      </div>

      {/* テンプレート例 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">メールテンプレート例</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">管理者通知用テンプレート</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              {templateExamples.admin}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">お客様確認用テンプレート</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              {templateExamples.customer}
            </pre>
          </div>
        </div>
      </div>

      {/* 外部リンク */}
      <div className="text-center">
        <a
          href="https://dashboard.emailjs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <SafeIcon icon={FiExternalLink} />
          <span>EmailJSダッシュボードを開く</span>
        </a>
      </div>
    </div>
  );
};

export default EmailJSSetup;