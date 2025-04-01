import 'package:flutter/material.dart';
import 'package:ai_study_companion/models/chat_message_model.dart';
import 'package:ai_study_companion/services/db_service.dart';
import 'package:ai_study_companion/services/ai_service.dart';
import 'package:uuid/uuid.dart';

class ChatbotProvider extends ChangeNotifier {
  final DatabaseService _dbService = DatabaseService();
  final AIService _aiService = AIService();
  final _uuid = Uuid();
  
  List<ChatMessageModel> _messages = [];
  bool _isLoading = false;
  String? _error;
  
  List<ChatMessageModel> get messages => _messages;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  Future<void> fetchChatHistory(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _messages = await _dbService.getChatHistory(userId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> sendMessage(String content, String userId) async {
    if (content.trim().isEmpty) return false;
    
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      // Create and save user message
      final userMessage = ChatMessageModel(
        id: _uuid.v4(),
        userId: userId,
        content: content,
        role: MessageRole.user,
        timestamp: DateTime.now(),
      );
      
      final savedUserMessage = await _dbService.saveChatMessage(userMessage);
      _messages.add(savedUserMessage);
      notifyListeners();
      
      // Prepare messages for AI
      final aiMessages = _messages
          .map((msg) => {
                'role': msg.role.toString().split('.').last,
                'content': msg.content,
              })
          .toList();
      
      // Get AI response
      final response = await _aiService.getChatbotResponse(aiMessages);
      
      // Create and save AI message
      final aiMessage = ChatMessageModel(
        id: _uuid.v4(),
        userId: userId,
        content: response,
        role: MessageRole.assistant,
        timestamp: DateTime.now(),
      );
      
      final savedAiMessage = await _dbService.saveChatMessage(aiMessage);
      _messages.add(savedAiMessage);
      
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
  
  Future<bool> clearChatHistory(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      await _dbService.clearChatHistory(userId);
      _messages = [];
      
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
  
  void clearError() {
    _error = null;
    notifyListeners();
  }
}

