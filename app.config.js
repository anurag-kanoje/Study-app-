/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  name: "StudyBuddy",
  slug: "studybuddy",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.studybuddy.app",
    buildNumber: "1"
  },
  android: {
    package: "com.studybuddy.app",
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: "#ffffff"
    },
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "NOTIFICATIONS"
    ]
  },
  web: {
    favicon: './assets/icon.png',
    bundler: 'metro'
  },
  plugins: [
    "expo-router",
    "expo-camera",
    "expo-document-picker",
    "expo-file-system",
    "expo-image-picker",
    "expo-notifications",
    [
      "expo-build-properties",
      {
        "android": {
          "compileSdkVersion": 34,
          "targetSdkVersion": 34,
          "buildToolsVersion": "34.0.0"
        }
      }
    ]
  ],
  extra: {
    eas: {
      projectId: "c41d94cd-cbfe-4099-a711-06f15abad7b3"
    }
  },
  scheme: "studybuddy",
  experiments: {
    tsconfigPaths: true
  },
  updates: {
    url: "https://u.expo.dev/c41d94cd-cbfe-4099-a711-06f15abad7b3"
  },
  runtimeVersion: {
    policy: "sdkVersion"
  }
};
