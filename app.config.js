/** @type {import('@expo/config').ExpoConfig} */
export default {
  name: "Study Buddy",
  slug: "study-appt1",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.thanos2k25.studybuddy"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.thanos2k25.studybuddy",
    versionCode: 1,
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    'expo-router'
  ],
  extra: {
    eas: {
      projectId: "77535ab2-8f68-48fc-add3-49d837e7e6b4"
    }
  },
  cli: {
    appVersionSource: "remote"
  }
};
