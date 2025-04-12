import 'dart:io';
import 'dart:typed_data';
import 'package:path/path.dart' as path;
import 'package:ai_study_companion/config/supabase_config.dart';
import 'package:ai_study_companion/services/supabase_service.dart';
import 'package:uuid/uuid.dart';

class StorageService {
  final SupabaseService _supabaseService = SupabaseService();
  final _uuid = Uuid();
  
  // Upload profile image
  Future<String> uploadProfileImage(String userId, File imageFile) async {
    final fileExtension = path.extension(imageFile.path);
    final fileName = '$userId/${_uuid.v4()}$fileExtension';
    
    final bytes = await imageFile.readAsBytes();
    final contentType = _getContentType(fileExtension);
    
    final url = await _supabaseService.uploadFile(
      SupabaseConfig.profileImagesBucket,
      fileName,
      bytes,
      contentType,
    );
    
    return url;
  }
  
  // Upload note attachment
  Future<String> uploadNoteAttachment(String userId, File file) async {
    final fileExtension = path.extension(file.path);
    final fileName = '$userId/${_uuid.v4()}$fileExtension';
    
    final bytes = await file.readAsBytes();
    final contentType = _getContentType(fileExtension);
    
    final url = await _supabaseService.uploadFile(
      SupabaseConfig.noteAttachmentsBucket,
      fileName,
      bytes,
      contentType,
    );
    
    return url;
  }
  
  // Upload image for summarization
  Future<String> uploadSummaryImage(String userId, File imageFile) async {
    final fileExtension = path.extension(imageFile.path);
    final fileName = '$userId/${_uuid.v4()}$fileExtension';
    
    final bytes = await imageFile.readAsBytes();
    final contentType = _getContentType(fileExtension);
    
    final url = await _supabaseService.uploadFile(
      SupabaseConfig.summaryImagesBucket,
      fileName,
      bytes,
      contentType,
    );
    
    return url;
  }
  
  // Upload bytes directly
  Future<String> uploadBytes({
    required String bucket,
    required String userId,
    required Uint8List bytes,
    required String fileExtension,
    String? contentType,
  }) async {
    final fileName = '$userId/${_uuid.v4()}$fileExtension';
    final mimeType = contentType ?? _getContentType(fileExtension);
    
    final url = await _supabaseService.uploadFile(
      bucket,
      fileName,
      bytes,
      mimeType,
    );
    
    return url;
  }
  
  // Delete file
  Future<void> deleteFile(String bucket, String url) async {
    // Extract the path from the URL
    final uri = Uri.parse(url);
    final pathSegments = uri.pathSegments;
    
    // The path should be the last segments after the bucket name
    final bucketIndex = pathSegments.indexOf(bucket);
    if (bucketIndex == -1 || bucketIndex == pathSegments.length - 1) {
      throw Exception('Invalid file URL');
    }
    
    final filePath = pathSegments.sublist(bucketIndex + 1).join('/');
    await _supabaseService.deleteFile(bucket, filePath);
  }
  
  // Get content type based on file extension
  String _getContentType(String fileExtension) {
    switch (fileExtension.toLowerCase()) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.pdf':
        return 'application/pdf';
      case '.doc':
        return 'application/msword';
      case '.docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case '.xls':
        return 'application/vnd.ms-excel';
      case '.xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case '.mp3':
        return 'audio/mpeg';
      case '.mp4':
        return 'video/mp4';
      case '.txt':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  }
}

