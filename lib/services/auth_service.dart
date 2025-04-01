import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:ai_study_companion/config/supabase_config.dart';
import 'package:ai_study_companion/models/user_model.dart';
import 'package:ai_study_companion/config/app_constants.dart';

class AuthService {
  final SupabaseClient _client = SupabaseConfig.client;
  
  // Check if user is authenticated
  Future<bool> isAuthenticated() async {
    final session = _client.auth.currentSession;
    return session != null && session.isExpired == false;
  }
  
  // Get current user
  Future<UserModel?> getCurrentUser() async {
    if (!await isAuthenticated()) return null;
    
    final user = _client.auth.currentUser;
    if (user == null) return null;
    
    try {
      final userData = await _client
          .from(SupabaseConfig.usersTable)
          .select()
          .eq('id', user.id)
          .single();
      
      return UserModel.fromJson(userData);
    } catch (e) {
      // If user exists in auth but not in users table, create a default entry
      final defaultUser = UserModel.fromSupabaseUser(user);
      await _client.from(SupabaseConfig.usersTable).insert(defaultUser.toJson());
      return defaultUser;
    }
  }
  
  // Sign up with email and password
  Future<UserModel> signUp({
    required String email,
    required String password,
    required String name,
    required UserRole role,
  }) async {
    final response = await _client.auth.signUp(
      email: email,
      password: password,
      data: {'name': name},
    );
    
    if (response.user == null) {
      throw Exception('Failed to sign up');
    }
    
    final user = UserModel.fromSupabaseUser(response.user!, role: role);
    
    // Insert user data into users table
    await _client.from(SupabaseConfig.usersTable).insert(user.toJson());
    
    return user;
  }
  
  // Sign in with email and password
  Future<UserModel> signIn({
    required String email,
    required String password,
  }) async {
    final response = await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
    
    if (response.user == null) {
      throw Exception('Failed to sign in');
    }
    
    try {
      final userData = await _client
          .from(SupabaseConfig.usersTable)
          .select()
          .eq('id', response.user!.id)
          .single();
      
      return UserModel.fromJson(userData);
    } catch (e) {
      // If user exists in auth but not in users table, create a default entry
      final defaultUser = UserModel.fromSupabaseUser(response.user!);
      await _client.from(SupabaseConfig.usersTable).insert(defaultUser.toJson());
      return defaultUser;
    }
  }
  
  // Sign in with Google
  Future<UserModel> signInWithGoogle() async {
    await _client.auth.signInWithOAuth(
      OAuthProvider.google,
      redirectTo: 'io.supabase.flutterquickstart://login-callback/',
    );
    
    // Note: This method will redirect to Google and then back to the app
    // The actual user data will be handled in the auth state change listener
    // This is just a placeholder return
    throw Exception('This method does not return a user directly');
  }
  
  // Sign in with Apple
  Future<UserModel> signInWithApple() async {
    await _client.auth.signInWithOAuth(
      OAuthProvider.apple,
      redirectTo: 'io.supabase.flutterquickstart://login-callback/',
    );
    
    // Note: This method will redirect to Apple and then back to the app
    // The actual user data will be handled in the auth state change listener
    // This is just a placeholder return
    throw Exception('This method does not return a user directly');
  }
  
  // Sign out
  Future<void> signOut() async {
    await _client.auth.signOut();
  }
  
  // Update user profile
  Future<UserModel> updateProfile({
    required String userId,
    String? name,
    String? avatarUrl,
    UserRole? role,
  }) async {
    final updates = <String, dynamic>{};
    
    if (name != null) updates['name'] = name;
    if (avatarUrl != null) updates['avatar_url'] = avatarUrl;
    if (role != null) updates['role'] = role.toString().split('.').last;
    
    final userData = await _client
        .from(SupabaseConfig.usersTable)
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    
    return UserModel.fromJson(userData);
  }
  
  // Reset password
  Future<void> resetPassword(String email) async {
    await _client.auth.resetPasswordForEmail(email);
  }
  
  // Update password
  Future<void> updatePassword(String newPassword) async {
    await _client.auth.updateUser(UserAttributes(password: newPassword));
  }
}

