import 'package:flutter/material.dart';
import 'package:ai_study_companion/models/note_model.dart';
import 'package:ai_study_companion/services/db_service.dart';
import 'package:uuid/uuid.dart';

class NotesProvider extends ChangeNotifier {
  final DatabaseService _dbService = DatabaseService();
  final _uuid = Uuid();
  
  List<NoteModel> _notes = [];
  bool _isLoading = false;
  String? _error;
  
  List<NoteModel> get notes => _notes;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  Future<void> fetchNotes(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _notes = await _dbService.getNotes(userId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<NoteModel?> getNoteById(String noteId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final note = await _dbService.getNoteById(noteId);
      _isLoading = false;
      notifyListeners();
      return note;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }
  
  Future<bool> createNote({
    required String userId,
    required String title,
    required String content,
    NoteCategory category = NoteCategory.general,
    List<String> tags = const [],
    List<String> attachments = const [],
    bool isFavorite = false,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final now = DateTime.now();
      final note = NoteModel(
        id: _uuid.v4(),
        userId: userId,
        title: title,
        content: content,
        category: category,
        tags: tags,
        attachments: attachments,
        createdAt: now,
        updatedAt: now,
        isFavorite: isFavorite,
      );
      
      final createdNote = await _dbService.createNote(note);
      _notes.add(createdNote);
      _notes.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
      
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
  
  Future<bool> updateNote({
    required String noteId,
    String? title,
    String? content,
    NoteCategory? category,
    List<String>? tags,
    List<String>? attachments,
    bool? isFavorite,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      // Find the note in the local list
      final index = _notes.indexWhere((note) => note.id == noteId);
      if (index == -1) {
        throw Exception('Note not found');
      }
      
      final note = _notes[index];
      final updatedNote = note.copyWith(
        title: title,
        content: content,
        category: category,
        tags: tags,
        attachments: attachments,
        updatedAt: DateTime.now(),
        isFavorite: isFavorite,
      );
      
      final result = await _dbService.updateNote(updatedNote);
      _notes[index] = result;
      _notes.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
      
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
  
  Future<bool> deleteNote(String noteId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      await _dbService.deleteNote(noteId);
      _notes.removeWhere((note) => note.id == noteId);
      
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
  
  Future<bool> toggleFavorite(String noteId) async {
    try {
      final index = _notes.indexWhere((note) => note.id == noteId);
      if (index == -1) {
        throw Exception('Note not found');
      }
      
      final note = _notes[index];
      return await updateNote(
        noteId: noteId,
        isFavorite: !note.isFavorite,
      );
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }
  
  List<NoteModel> searchNotes(String query) {
    if (query.isEmpty) {
      return _notes;
    }
    
    final lowercaseQuery = query.toLowerCase();
    return _notes.where((note) {
      return note.title.toLowerCase().contains(lowercaseQuery) ||
             note.content.toLowerCase().contains(lowercaseQuery) ||
             note.tags.any((tag) => tag.toLowerCase().contains(lowercaseQuery));
    }).toList();
  }
  
  List<NoteModel> filterNotesByCategory(NoteCategory category) {
    return _notes.where((note) => note.category == category).toList();
  }
  
  List<NoteModel> getFavoriteNotes() {
    return _notes.where((note) => note.isFavorite).toList();
  }
  
  void clearError() {
    _error = null;
    notifyListeners();
  }
}

