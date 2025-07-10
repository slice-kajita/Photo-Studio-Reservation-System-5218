// EmailJS設定ファイル
export const EMAILJS_CONFIG = {
  // EmailJSのダッシュボードから取得してください
  PUBLIC_KEY: 'vJFr8_3nl6xh3hs9s', // EmailJSの Public Key
  SERVICE_ID: 'service_4mhu164', // EmailJSの Service ID
  TEMPLATE_ID_ADMIN: 'template_6w6i19c', // 管理者通知用テンプレート
  TEMPLATE_ID_CUSTOMER: 'template_mhhgawh' // お客様確認用テンプレート
};

// 設定確認
export const validateEmailJSConfig = () => {
  const { PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID_ADMIN, TEMPLATE_ID_CUSTOMER } = EMAILJS_CONFIG;
  
  if (!PUBLIC_KEY || PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    throw new Error('EmailJS Public Key が設定されていません');
  }
  
  if (!SERVICE_ID || SERVICE_ID === 'YOUR_SERVICE_ID') {
    throw new Error('EmailJS Service ID が設定されていません');
  }
  
  if (!TEMPLATE_ID_ADMIN || TEMPLATE_ID_ADMIN === 'YOUR_ADMIN_TEMPLATE_ID') {
    throw new Error('管理者通知用テンプレートIDが設定されていません');
  }
  
  if (!TEMPLATE_ID_CUSTOMER || TEMPLATE_ID_CUSTOMER === 'YOUR_CUSTOMER_TEMPLATE_ID') {
    throw new Error('お客様確認用テンプレートIDが設定されていません');
  }
  
  return true;
};