import 'package:supabase_flutter/supabase_flutter.dart';

enum UserRole { student, teacher, parent }

class UserModel {
  final String id;
  final String email;
  final String? name;
  final String? avatarUrl;
  final UserRole role;
  final DateTime createdAt;
  final DateTime? lastLogin;
  
  UserModel({
    required this.id,
    required this.email,
    this.name,
    this.avatarUrl,
    required this.role,
    required this.createdAt,
    this.lastLogin,
  });
  
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      avatarUrl: json['avatar_url'],
      role: _parseRole(json['role']),
      createdAt: DateTime.parse(json['created_at']),
      lastLogin: json['last_login'] != null 
          ? DateTime.parse(json['last_login']) 
          : null,
    );
  }
  
  factory UserModel.fromSupabaseUser(User user, {UserRole role = UserRole.student}) {
    return UserModel(
      id: user.id,
      email: user.email ?? '',
      name: user.userMetadata?['name'] as String?,
      avatarUrl: user.userMetadata?['avatar_url'] as String?,
      role: role,
      createdAt: user.createdAt,
      lastLogin: user.lastSignInAt,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'avatar_url': avatarUrl,
      'role': role.toString().split('.').last,
      'created_at': createdAt.toIso8601String(),
      'last_login': lastLogin?.toIso8601String(),
    };
  }
  
  static UserRole _parseRole(String? roleStr) {
    switch (roleStr) {
      case 'teacher':
        return UserRole.teacher;
      case 'parent':
        return UserRole.parent;
      case 'student':
      default:
        return UserRole.student;
    }
  }
  
  UserModel copyWith({
    String? name,
    String? avatarUrl,
    UserRole? role,
    DateTime? lastLogin,
  }) {
    return UserModel(
      id: this.id,
      email: this.email,
      name: name ?? this.name,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      role: role ?? this.role,
      createdAt: this.createdAt,
      lastLogin: lastLogin ?? this.lastLogin,
    );
  }
}

