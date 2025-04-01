import 'dart:io';
import 'package:flutter/material.dart';
import 'package:ai_study_companion/models/summary_model.dart';
import 'package:ai_study_companion/services/db_service.dart';
import 'package:ai_study_companion/services/ai_service.dart';
import 'package:uuid/uuid.dart';

class SummaryProvider extends ChangeNotifier {
  final DatabaseService _dbService = DatabaseService();
  final AIService _aiService = AIService();
  final _uuid = Uuid();
  
  List<SummaryModel> _summaries = [];
  bool _isLoading = false;
  String? _error;
  String? _currentSummary;
  
  List<SummaryModel> get summaries => _summaries;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get currentSummary => _currentSummary;
  
  Future<void> fetchSummaries(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _summaries = await _dbService.getSummaries(userId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<String?> summarizeText(String text, String userId) async {
    _isLoading = true;
    _error = null;
    _currentSummary = null;
    notifyListeners();
    
    try {
      final summary = await _aiService.summarizeText(text);
      _currentSummary = summary;
      
      // Save the summary to the database
      final summaryModel = SummaryModel(
        id: _uuid.v4(),
        userId: userId,
        originalContent: text,
        summaryContent: summary,
        type: SummaryType.text,
        createdAt: DateTime.now(),
      );
      
      final savedSummary = await _dbService.createSummary(summaryModel);
      _summaries.insert(0, savedSummary);
      
      _isLoading = false;
      notifyListeners();
      return summary;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }
  
  Future<String?> summarizeImage(File imageFile, String userId) async {
    _isLoading = true;
    _error = null;
    _currentSummary = null;
    notifyListeners();
    
    try {
      final summary = await _aiService.summarizeImage(imageFile, userId);
      _currentSummary = summary;
      
      // Save the summary to the database
      final summaryModel = SummaryModel(
        id: _uuid.v4(),
        userId: userId,
        originalContent: imageFile.path, // Store the local path temporarily
        summaryContent: summary,
        type: SummaryType.image,
        createdAt: DateTime.now(),
      );
      
      final savedSummary = await _dbService.createSummary(summaryModel);
      _summaries.insert(0, savedSummary);
      
      _isLoading = false;
      notifyListeners();
      return summary;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }
  
  Future<String?> summarizeVideo(String videoUrl, String userId) async {
    _isLoading = true;
    _error = null;
    _currentSummary = null;
    notifyListeners();
    
    try {
      final summary = await _aiService.summarizeVideo(videoUrl);
      _currentSummary = summary;
      
      // Save the summary to the database
      final summaryModel = SummaryModel(
        id: _uuid.v4(),
        userId: userId,
        originalContent: videoUrl,
        summaryContent: summary,
        type: SummaryType.video,
        sourceUrl: videoUrl,
        createdAt: DateTime.now(),
      );
      
      final savedSummary = await _dbService.createSummary(summaryModel);
      _summaries.insert(0, savedSummary);
      
      _isLoading = false;
      notifyListeners();
      return summary;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }
  
  Future<bool> deleteSummary(String summaryId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      await _dbService.deleteSummary(summaryId);
      _summaries.removeWhere((summary) => summary.id == summaryId);
      
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
  
  Future<List<Map<String, String>>?> generateFlashcards(String text) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final flashcards = await _aiService.generateFlashcards(text);
      
      _isLoading = false;
      notifyListeners();
      return flashcards;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }
  
  Future<List<Map<String, dynamic>>?> generateQuizQuestions(String text) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final questions = await _aiService.generateQuizQuestions(text);
      
      _isLoading = false;
      notifyListeners();
      return questions;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }
  
  void clearCurrentSummary() {
    _currentSummary = null;
    notifyListeners();
  }
  
  void clearError() {
    _error = null;
    notifyListeners();
  }
}

