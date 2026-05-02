import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'tr',
    resources: {
      tr: {
        translation: {
          chat: 'Sohbet',
          buy_credits: 'Kredi Al',
          admin: 'Admin',
          install: 'Kurulum',
          login: 'Giriş Yap',
          register: 'Kayıt Ol',
          thinking: 'Düşünüyor',
          writing: 'Yazıyor',
          credits: 'Kredi',
          first_name: 'Ad',
          last_name: 'Soyad',
          phone: 'Telefon',
          country: 'Ülke',
          city: 'Şehir',
          password: 'Şifre',
          logout: 'Çıkış Yap',
          welcome: 'Size nasıl yardımcı olabilirim?',
          packages: 'Kredi Paketleri',
          purchase: 'Satın Al',
          footer_disclaimer: 'CroopsAI hata yapabilir. Önemli bilgileri kontrol edin.'
        }
      },
      en: {
        translation: {
          chat: 'Chat',
          buy_credits: 'Buy Credits',
          admin: 'Admin',
          install: 'Installation',
          login: 'Login',
          register: 'Register',
          thinking: 'Thinking',
          writing: 'Writing',
          credits: 'Credits',
          first_name: 'First Name',
          last_name: 'Last Name',
          phone: 'Phone',
          country: 'Country',
          city: 'City',
          password: 'Password',
          logout: 'Logout',
          welcome: 'How can I help you?',
          packages: 'Credit Packages',
          purchase: 'Purchase',
          footer_disclaimer: 'CroopsAI can make mistakes. Check important info.'
        }
      }
    }
  });

export default i18n;
