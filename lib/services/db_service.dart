import 'package:ai_study_companion/config/supabase_config.dart';
import 'package:ai_study_companion/models/note_model.dart';
import 'package:ai_study_companion/models/summary_model.dart';
import 'package:ai_study_companion/models/chat_message_model.dart';
import 'package:ai_study_companion/models/parental_control_model.dart';
import 'package:ai_study_companion/services/supabase_service.dart';
import 'package:uuid/uuid.dart';

class DatabaseService {
  final SupabaseService _supabaseService = SupabaseService();
  final _uuid = Uuid();
  
  // Notes CRUD operations
  Future<List<NoteModel>> getNotes(String userId) async {
    final data = await _supabaseService.fetchData(
      SupabaseConfig.notesTable,
      column: 'user_id',
      value: userId,
      orderBy: 'updated_at',
      ascending: false,
    );
    
    return data.map((json) => NoteModel.fromJson(json)).toList();
  }
  
  Future<NoteModel> getNoteById(String noteId) async {
    final data = await _supabaseService.fetchData(
      SupabaseConfig.notesTable,
      column: 'id',
      value: noteId,
    );
    
    if (data.isEmpty) {
      throw Exception('Note not found');
    }
    
    return NoteModel.fromJson(data.first);
  }
  
  Future<NoteModel> createNote(NoteModel note) async {
    final now = DateTime.now();
    final noteData = {
      'id': note.id.isEmpty ? _uuid.v4() : note.id,
      'user_id': note.userId,
      'title': note.title,
      'content': note.content,
      'category': note.category.toString().split('.').last,
      'tags': note.tags,
      'attachments': note.attachments,
      'created_at': now.toIso8601String(),
      'updated_at': now.toIso8601String(),
      'is_favorite': note.isFavorite,
    };
    
    final data = await _supabaseService.insertData(
      SupabaseConfig.notesTable,
      noteData,
    );
    
    return NoteModel.fromJson(data);
  }
  
  Future<NoteModel> updateNote(NoteModel note) async {
    final now = DateTime.now();
    final noteData = {
      'title': note.title,
      'content': note.content,
      'category': note.category.toString().split('.').last,
      'tags': note.tags,
      'attachments': note.attachments,
      'updated_at': now.toIso8601String(),
      'is_favorite': note.isFavorite,
    };
    
    final data = await _supabaseService.updateData(
      SupabaseConfig.notesTable,
      note.id,
      noteData,
    );
    
    return NoteModel.fromJson(data);
  }
  
  Future<void> deleteNote(String noteId) async {
    await _supabaseService.deleteData(SupabaseConfig.notesTable, noteId);
  }
  
  // Summaries CRUD operations
  Future<List<SummaryModel>> getSummaries(String userId) async {
    final data = await _supabaseService.fetchData(
      SupabaseConfig.summariesTable,
      column: 'user_id',
      value: userId,
      orderBy: 'created_at',
      ascending: false,
    );
    
    return data.map((json) => SummaryModel.fromJson(json)).toList();
  }
  
  Future<SummaryModel> getSummaryById(String summaryId) async {
    final data = await _supabaseService.fetchData(
      SupabaseConfig.summariesTable,
      column: 'id',
      value: summaryId,
    );
    
    if (data.isEmpty) {
      throw Exception('Summary not found');
    }
    
    return SummaryModel.fromJson(data.first);
  }
  
  Future<SummaryModel> createSummary(SummaryModel summary) async {
    final summaryData = {
      'id': summary.id.isEmpty ? _uuid.v4() : summary.id,
      'user_id': summary.userId,
      'original_content': summary.originalContent,
      'summary_content': summary.summaryContent,
      'type': summary.type.toString().split('.').last,
      'source_url': summary.sourceUrl,
      'thumbnail_url': summary.thumbnailUrl,
      'created_at': DateTime.now().toIso8601String(),
    };
    
    final data = await _supabaseService.insertData(
      SupabaseConfig.summariesTable,
      summaryData,
    );
    
    return SummaryModel.fromJson(data);
  }
  
  Future<void> deleteSummary(String summaryId) async {
    await _supabaseService.deleteData(SupabaseConfig.summariesTable, summaryId);
  }
  
  // Chat history operations
  Future<List<ChatMessageModel>> getChatHistory(String userId) async {
    final data = await _supabaseService.fetchData(
      SupabaseConfig.chatHistoryTable,
      column: 'user_id',
      value: userId,
      orderBy: 'timestamp',
      ascending: true,
    );
    
    return data.map((json) => ChatMessageModel.fromJson(json)).toList();
  }
  
  Future<ChatMessageModel> saveChatMessage(ChatMessageModel message) async {
    final messageData = {
      'id': message.id.isEmpty ? _uuid.v4() : message.id,
      'user_id': message.userId,
      'content': message.content,
      'role': message.role.toString().split('.').last,
      'timestamp': message.timestamp.toIso8601String(),
    };
    
    final data = await _supabaseService.insertData(
      SupabaseConfig.chatHistoryTable,
      messageData,
    );
    
    return ChatMessageModel.fromJson(data);
  }
  
  Future<void> clearChatHistory(String userId) async {
    await SupabaseConfig.client
        .from(SupabaseConfig.chatHistoryTable)
        .delete()
        .eq('user_id', userId);
  }
  
  // Parental controls operations
  Future<ParentalControlModel?> getParentalControls(String userId) async {
    try {
      final data = await _supabaseService.fetchData(
        SupabaseConfig.parentalControlsTable,
        column: 'user_id',
        value: userId,
      );
      
      if (data.isEmpty) {
        return null;
      }
      
      return ParentalControlModel.fromJson(data.first);
    } catch (e) {
      return null;
    }
  }
  
  Future<ParentalControlModel> createParentalControls(ParentalControlModel controls) async {
    final now = DateTime.now();
    final controlsData = {
      'id': controls.id.isEmpty ? _uuid.v4() : controls.id,
      'user_id': controls.userId,
      'parent_id': controls.parentId,
      'screen_time_limit': controls.screenTimeLimit,
      'content_restrictions': controls.contentRestrictions,
      'study_tracking_enabled': controls.studyTrackingEnabled,
      'schedule_settings': controls.scheduleSettings,
      'created_at': now.toIso8601String(),
      'updated_at': now.toIso8601String(),
    };
    
    final data = await _supabaseService.insertData(
      SupabaseConfig.parentalControlsTable,
      controlsData,
    );
    
    return ParentalControlModel.fromJson(data);
  }
  
  Future<ParentalControlModel> updateParentalControls(ParentalControlModel controls) async {
    final controlsData = {
      'screen_time_limit': controls.screenTimeLimit,
      'content_restrictions': controls.contentRestrictions,
      'study_tracking_enabled': controls.studyTrackingEnabled,
      'schedule_settings': controls.scheduleSettings,
      'updated_at': DateTime.now().toIso8601String(),
    };
    
    final data = await _supabaseService.updateData(
      SupabaseConfig.parentalControlsTable,
      controls.id,
      controlsData,
    );
    
    return ParentalControlModel.fromJson(data);
  }
}

