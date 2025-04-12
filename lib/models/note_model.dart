enum NoteCategory { general, math, science, language, history, other }

class NoteModel {
  final String id;
  final String userId;
  final String title;
  final String content;
  final NoteCategory category;
  final List<String> tags;
  final List<String> attachments;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isFavorite;
  
  NoteModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.content,
    this.category = NoteCategory.general,
    this.tags = const [],
    this.attachments = const [],
    required this.createdAt,
    required this.updatedAt,
    this.isFavorite = false,
  });
  
  factory NoteModel.fromJson(Map<String, dynamic> json) {
    return NoteModel(
      id: json['id'],
      userId: json['user_id'],
      title: json['title'],
      content: json['content'],
      category: _parseCategory(json['category']),
      tags: List<String>.from(json['tags'] ?? []),
      attachments: List<String>.from(json['attachments'] ?? []),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      isFavorite: json['is_favorite'] ?? false,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'title': title,
      'content': content,
      'category': category.toString().split('.').last,
      'tags': tags,
      'attachments': attachments,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'is_favorite': isFavorite,
    };
  }
  
  static NoteCategory _parseCategory(String? categoryStr) {
    switch (categoryStr) {
      case 'math':
        return NoteCategory.math;
      case 'science':
        return NoteCategory.science;
      case 'language':
        return NoteCategory.language;
      case 'history':
        return NoteCategory.history;
      case 'other':
        return NoteCategory.other;
      case 'general':
      default:
        return NoteCategory.general;
    }
  }
  
  NoteModel copyWith({
    String? title,
    String? content,
    NoteCategory? category,
    List<String>? tags,
    List<String>? attachments,
    DateTime? updatedAt,
    bool? isFavorite,
  }) {
    return NoteModel(
      id: this.id,
      userId: this.userId,
      title: title ?? this.title,
      content: content ?? this.content,
      category: category ?? this.category,
      tags: tags ?? this.tags,
      attachments: attachments ?? this.attachments,
      createdAt: this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}

