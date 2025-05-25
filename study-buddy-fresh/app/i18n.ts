import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          loginToStudyBuddy: 'Login to StudyBuddy',
          email: 'Email',
          password: 'Password',
          iAmA: 'I am a:',
          student: 'Student',
          teacher: 'Teacher',
          language: 'Language',
          selectLanguage: 'Select Language',
          english: 'English',
          hindi: 'Hindi',
          chhattisgarhi: 'Chhattisgarhi',
          login: 'Login',
          dontHaveAccount: "Don't have an account?",
          signUp: 'Sign up',
          loginSuccessful: 'Login Successful',
          welcomeMessage: 'Welcome, {{role}}! You\'ve successfully logged in.',
        },
      },
      hi: {
        translation: {
          loginToStudyBuddy: 'स्टडीबडी में लॉगिन करें',
          email: 'ईमेल',
          password: 'पासवर्ड',
          iAmA: 'मैं हूँ:',
          student: 'छात्र',
          teacher: 'शिक्षक',
          language: 'भाषा',
          selectLanguage: 'भाषा चुनें',
          english: 'अंग्रेजी',
          hindi: 'हिंदी',
          chhattisgarhi: 'छत्तीसगढ़ी',
          login: 'लॉगिन',
          dontHaveAccount: 'खाता नहीं है?',
          signUp: 'साइन अप करें',
          loginSuccessful: 'लॉगिन सफल',
          welcomeMessage: 'स्वागत है, {{role}}! आप सफलतापूर्वक लॉग इन हो गए हैं।',
        },
      },
      hne: {
        translation: {
          loginToStudyBuddy: 'स्टडीबडी म लॉगिन करव',
          email: 'ईमेल',
          password: 'पासवर्ड',
          iAmA: 'मय हवं:',
          student: 'छात्र',
          teacher: 'शिक्षक',
          language: 'भाखा',
          selectLanguage: 'भाखा चुनव',
          english: 'अंगरेजी',
          hindi: 'हिंदी',
          chhattisgarhi: 'छत्तीसगढ़ी',
          login: 'लॉगिन',
          dontHaveAccount: 'खाता नइ हे?',
          signUp: 'साइन अप करव',
          loginSuccessful: 'लॉगिन सफल होगे',
          welcomeMessage: 'स्वागत हे, {{role}}! आप मन सफलतापूर्वक लॉग इन हो गए हव।',
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

