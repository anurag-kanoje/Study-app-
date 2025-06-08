export default {
  name: "StudyBuddy",
  slug: "studybuddy",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#ffffff"
    },
    package: "com.studybuddy.app"
  },
  extra: {
    eas: {
      projectId: "6a0bb491-e28d-48aa-93be-e6ddcd8c3bc6"
    }
  }
}; 