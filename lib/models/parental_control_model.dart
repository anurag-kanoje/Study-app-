class ParentalControlModel {
  final String id;
  final String userId;
  final String parentId;
  final int screenTimeLimit; // in minutes
  final List<String> contentRestrictions;
  final bool studyTrackingEnabled;
  final Map<String, dynamic>? scheduleSettings;
  final DateTime createdAt;
  final DateTime updatedAt;
  
  ParentalControlModel({
    required this.id,
    required this.userId,
    required this.parentId,
    required this.screenTimeLimit,
    required this.contentRestrictions,
    required this.studyTrackingEnabled,
    this.scheduleSettings,
    required this.createdAt,
    required this.updatedAt,
  });
  
  factory ParentalControlModel.fromJson(Map<String, dynamic> json) {
    return ParentalControlModel(
      id: json['id'],
      userId: json['user_id'],
      parentId: json['parent_id'],
      screenTimeLimit: json['screen_time_limit'],
      contentRestrictions: List<String>.from(json['content_restrictions'] ?? []),
      studyTrackingEnabled: json['study_tracking_enabled'] ?? false,
      scheduleSettings: json['schedule_settings'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'parent_id': parentId,
      'screen_time_limit': screenTimeLimit,
      'content_restrictions': contentRestrictions,
      'study_tracking_enabled': studyTrackingEnabled,
      'schedule_settings': scheduleSettings,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
  
  ParentalControlModel copyWith({
    int? screenTimeLimit,
    List<String>? contentRestrictions,
    bool? studyTrackingEnabled,
    Map<String, dynamic>? scheduleSettings,
    DateTime? updatedAt,
  }) {
    return ParentalControlModel(
      id: this.id,
      userId: this.userId,
      parentId: this.parentId,
      screenTimeLimit: screenTimeLimit ?? this.screenTimeLimit,
      contentRestrictions: contentRestrictions ?? this.contentRestrictions,
      studyTrackingEnabled: studyTrackingEnabled ?? this.studyTrackingEnabled,
      scheduleSettings: scheduleSettings ?? this.scheduleSettings,
      createdAt: this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

