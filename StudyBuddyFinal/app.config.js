module.exports = {
  name: "StudyBuddy",
  slug: "studybuddy",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.studybuddy.app"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.studybuddy.app",
    versionCode: 1
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "6a0bb491-e28d-48aa-93be-e6ddcd8c3bc6"
    }
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
  ]
}; 