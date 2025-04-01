import 'package:flutter/material.dart';
import 'package:ai_study_companion/models/parental_control_model.dart';
import 'package:ai_study_companion/services/db_service.dart';
import 'package:ai_study_companion/config/app_constants.dart';
import 'package:uuid/uuid.dart';

class ParentalControlProvider extends ChangeNotifier {
  final DatabaseService _dbService = DatabaseService();
  final _uuid = Uuid();
  
  ParentalControlModel? _controls;
  bool _isLoading = false;
  String? _error;
  
  ParentalControlModel? get controls => _controls;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  Future<void> fetchParentalControls(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _controls = await _dbService.getParentalControls(userId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> createParentalControls({
    required String userId,
    required String parentId,
    int? screenTimeLimit,
    List<String>? contentRestrictions,
    bool? studyTrackingEnabled,
    Map<String, dynamic>? scheduleSettings,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final now = DateTime.now();
      final controls = ParentalControlModel(
        id: _uuid.v4(),
        userId: userId,
        parentId: parentId,
        screenTimeLimit: screenTimeLimit ?? AppConstants.defaultScreenTimeLimit,
        contentRestrictions: contentRestrictions ?? AppConstants.defaultContentRestrictions,
        studyTrackingEnabled: studyTrackingEnabled ?? true,
        scheduleSettings: scheduleSettings,
        createdAt: now,
        updatedAt: now,
      );
      
      _controls = await _dbService.createParentalControls(controls);
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  Future<bool> updateParentalControls({
    int? screenTimeLimit,
    List<String>? contentRestrictions,
    bool? studyTrackingEnabled,
    Map<String, dynamic>? scheduleSettings,
  }) async {
    if (_controls == null) {
      _error = 'No parental controls found to update';
      notifyListeners();
      return false;
    }
    
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final updatedControls = _controls!.copyWith(
        screenTimeLimit: screenTimeLimit,
        contentRestrictions: contentRestrictions,
        studyTrackingEnabled: studyTrackingEnabled,
        scheduleSettings: scheduleSettings,
        updatedAt: DateTime.now(),
      );
      
      _controls = await _dbService.updateParentalControls(updatedControls);
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  bool isScreenTimeExceeded(int minutesUsed) {
    if (_controls == null) return false;
    return minutesUsed >= _controls!.screenTimeLimit;
  }
  
  bool isContentRestricted(String contentType) {
    if (_controls == null) return false;
    return _controls!.contentRestrictions.contains(contentType);
  }
  
  void clearError() {
    _error = null;
    notifyListeners();
  }
}

