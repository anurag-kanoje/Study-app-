import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:ai_study_companion/config/supabase_config.dart';

class SupabaseService {
  final SupabaseClient _client = SupabaseConfig.client;
  
  // Generic fetch method
  Future<List<Map<String, dynamic>>> fetchData(
    String table, {
    String? column,
    dynamic value,
    String? orderBy,
    bool ascending = false,
    int? limit,
  }) async {
    var query = _client.from(table).select();
    
    if (column != null && value != null) {
      query = query.eq(column, value);
    }
    
    if (orderBy != null) {
      query = query.order(orderBy, ascending: ascending);
    }
    
    if (limit != null) {
      query = query.limit(limit);
    }
    
    final response = await query;
    return response;
  }
  
  // Generic insert method
  Future<Map<String, dynamic>> insertData(
    String table,
    Map<String, dynamic> data,
  ) async {
    final response = await _client.from(table).insert(data).select().single();
    return response;
  }
  
  // Generic update method
  Future<Map<String, dynamic>> updateData(
    String table,
    String id,
    Map<String, dynamic> data,
  ) async {
    final response = await _client
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
    return response;
  }
  
  // Generic delete method
  Future<void> deleteData(String table, String id) async {
    await _client.from(table).delete().eq('id', id);
  }
  
  // Upload file to storage
  Future<String> uploadFile(
    String bucket,
    String path,
    List<int> fileBytes,
    String contentType,
  ) async {
    await _client.storage.from(bucket).uploadBinary(
      path,
      fileBytes,
      fileOptions: FileOptions(contentType: contentType),
    );
    
    final response = _client.storage.from(bucket).getPublicUrl(path);
    return response;
  }
  
  // Delete file from storage
  Future<void> deleteFile(String bucket, String path) async {
    await _client.storage.from(bucket).remove([path]);
  }
  
  // Get public URL for a file
  String getPublicUrl(String bucket, String path) {
    return _client.storage.from(bucket).getPublicUrl(path);
  }
  
  // Listen to real-time changes
  RealtimeChannel subscribeToChanges(
    String table,
    void Function(dynamic payload) callback,
  ) {
    final channel = _client.channel('public:$table');
    
    channel.on(
      RealtimeListenTypes.postgresChanges,
      ChannelFilter(event: '*', schema: 'public', table: table),
      (payload, [_]) => callback(payload),
    ).subscribe();
    
    return channel;
  }
}

