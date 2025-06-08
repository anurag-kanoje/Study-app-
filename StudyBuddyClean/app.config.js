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
      projectId: "c41d94cd-cbfe-4099-a711-06f15abad7b3"
    }
  }
}; 