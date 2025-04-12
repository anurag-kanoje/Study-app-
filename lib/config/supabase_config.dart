import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static final String url = dotenv.env['SUPABASE_URL'] ?? '';
  static final String anonKey = dotenv.env['SUPABASE_ANON_KEY'] ?? '';
  
  static final SupabaseClient client = Supabase.instance.client;
  
  // Table names
  static const String usersTable = 'users';
  static const String notesTable = 'notes';
  static const String summariesTable = 'summaries';
  static const String chatHistoryTable = 'chat_history';
  static const String parentalControlsTable = 'parental_controls';
  
  // Storage buckets
  static const String noteAttachmentsBucket = 'note_attachments';
  static const String profileImagesBucket = 'profile_images';
  static const String summaryImagesBucket = 'summary_images';
}

