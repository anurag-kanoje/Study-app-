class AppConstants {
  // API endpoints
  static const String openAiApiUrl = 'https://api.openai.com/v1/chat/completions';
  static const String googleCloudVisionApiUrl = 'https://vision.googleapis.com/v1/images:annotate';
  
  // User roles
  static const String roleStudent = 'student';
  static const String roleTeacher = 'teacher';
  static const String roleParent = 'parent';
  
  // Summary types
  static const String summaryTypeText = 'text';
  static const String summaryTypeImage = 'image';
  static const String summaryTypeVideo = 'video';
  
  // Parental control settings
  static const int defaultScreenTimeLimit = 120; // 2 hours in minutes
  static const List<String> defaultContentRestrictions = ['social_media', 'games'];
  
  // Animation durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 400);
  static const Duration longAnimationDuration = Duration(milliseconds: 800);
  
  // Error messages
  static const String errorGeneric = 'Something went wrong. Please try again.';
  static const String errorNoInternet = 'No internet connection. Please check your network.';
  static const String errorAuthentication = 'Authentication failed. Please try again.';
  static const String errorPermission = 'You do not have permission to access this feature.';
  
  // Success messages
  static const String successNoteCreated = 'Note created successfully!';
  static const String successNoteUpdated = 'Note updated successfully!';
  static const String successNoteDeleted = 'Note deleted successfully!';
  static const String successSummaryGenerated = 'Summary generated successfully!';
  static const String successProfileUpdated = 'Profile updated successfully!';
  static const String successParentalControlsUpdated = 'Parental controls updated successfully!';
}

