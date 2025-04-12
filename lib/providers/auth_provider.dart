import 'package:flutter/material.dart';
import 'package:ai_study_companion/models/user_model.dart';
import 'package:ai_study_companion/services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  UserModel? _user;
  bool _isLoading = false;
  String? _error;
  
  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  
  AuthProvider() {
    _initUser();
  }
  
  Future<void> _initUser() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      _user = await _authService.getCurrentUser();
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> signUp({
    required String email,
    required String password,
    required String name,
    required UserRole role,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _user = await _authService.signUp(
        email: email,
        password: password,
        name: name,
        role: role,
      );
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> signIn({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _user = await _authService.signIn(
        email: email,
        password: password,
      );
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> signInWithGoogle() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      await _authService.signInWithGoogle();
      // The actual user data will be handled in the auth state change listener
      // We'll just return true here and let the listener update the user
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> signInWithApple() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      await _authService.signInWithApple();
      // The actual user data will be handled in the auth state change listener
      // We'll just return true here and let the listener update the user
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<void> signOut() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      await _authService.signOut();
      _user = null;
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> updateProfile({
    String? name,
    String? avatarUrl,
    UserRole? role,
  }) async {
    if (_user == null) return false;
    
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _user = await _authService.updateProfile(
        userId: _user!.id,
        name: name,
        avatarUrl: avatarUrl,
        role: role,
      );
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> resetPassword(String email) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      await _authService.resetPassword(email);
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> updatePassword(String newPassword) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      await _authService.updatePassword(newPassword);
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  void clearError() {
    _error = null;
    notifyListeners();
  }
}

