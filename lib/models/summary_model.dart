enum SummaryType { text, image, video }

class SummaryModel {
  final String id;
  final String userId;
  final String originalContent;
  final String summaryContent;
  final SummaryType type;
  final String? sourceUrl;
  final String? thumbnailUrl;
  final DateTime createdAt;
  
  SummaryModel({
    required this.id,
    required this.userId,
    required this.originalContent,
    required this.summaryContent,
    required this.type,
    this.sourceUrl,
    this.thumbnailUrl,
    required this.createdAt,
  });
  
  factory SummaryModel.fromJson(Map<String, dynamic> json) {
    return SummaryModel(
      id: json['id'],
      userId: json['user_id'],
      originalContent: json['original_content'],
      summaryContent: json['summary_content'],
      type: _parseType(json['type']),
      sourceUrl: json['source_url'],
      thumbnailUrl: json['thumbnail_url'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'original_content': originalContent,
      'summary_content': summaryContent,
      'type': type.toString().split('.').last,
      'source_url': sourceUrl,
      'thumbnail_url': thumbnailUrl,
      'created_at': createdAt.toIso8601String(),
    };
  }
  
  static SummaryType _parseType(String? typeStr) {
    switch (typeStr) {
      case 'image':
        return SummaryType.image;
      case 'video':
        return SummaryType.video;
      case 'text':
      default:
        return SummaryType.text;
    }
  }
}

