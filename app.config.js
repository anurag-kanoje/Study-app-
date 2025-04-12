/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  name: 'StudyBuddy',
  slug: 'studybuddy',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
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
    bundleIdentifier: 'com.studybuddy.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.studybuddy.app',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    [
      'expo-camera',
      {
        cameraPermission: 'Allow StudyBuddy to access your camera to scan documents and take photos.',
      },
    ],
    'expo-document-picker',
    'expo-file-system',
    'expo-image-picker',
    'expo-notifications',
  ],
  extra: {
    eas: {
      projectId: 'c41d94cd-cbfe-4099-a711-06f15abad7b3'
    }
  },
  scheme: 'studybuddy',
  experiments: {
    tsconfigPaths: true
  },
};
