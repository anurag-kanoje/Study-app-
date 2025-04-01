enum MessageRole { user, assistant, system }

class ChatMessageModel {
  final String id;
  final String userId;
  final String content;
  final MessageRole role;
  final DateTime timestamp;
  
  ChatMessageModel({
    required this.id,
    required this.userId,
    required this.content,
    required this.role,
    required this.timestamp,
  });
  
  factory ChatMessageModel.fromJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      id: json['id'],
      userId: json['user_id'],
      content: json['content'],
      role: _parseRole(json['role']),
      timestamp: DateTime.parse(json['timestamp']),
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'content': content,
      'role': role.toString().split('.').last,
      'timestamp': timestamp.toIso8601String(),
    };
  }
  
  static MessageRole _parseRole(String? roleStr) {
    switch (roleStr) {
      case 'assistant':
        return MessageRole.assistant;
      case 'system':
        return MessageRole.system;
      case 'user':
      default:
        return MessageRole.user;
    }
  }
}

