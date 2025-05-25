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
    bundleIdentifier: 'com.thanos2k25.studybuddy',
  },
  android: {
    package: 'com.thanos2k25.studybuddy',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    versionCode: 1,
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "RECORD_AUDIO",
      "VIBRATE"
    ]
  },
  web: {
    favicon: './assets/icon.png',
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
      projectId: '6a0bb491-e28d-48aa-93be-e6ddcd8c3bc6'
    }
  },
  scheme: 'studybuddy',
  experiments: {
    tsconfigPaths: true
  },
};
