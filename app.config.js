/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  name: 'StudyBuddy',
  slug: 'studybuddy',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: [
    '**/*',
  ],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-router',
      {
        origin: 'https://your-domain.com',
      },
    ],
    'expo-splash-screen',
  ],
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
  },
};
