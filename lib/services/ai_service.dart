import 'dart:convert';
import 'dart:io';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:ai_study_companion/config/app_constants.dart';
import 'package:ai_study_companion/services/storage_service.dart';

class AIService {
  final String _openAiApiKey = dotenv.env['OPENAI_API_KEY'] ?? '';
  final String _googleCloudApiKey = dotenv.env['GOOGLE_CLOUD_API_KEY'] ?? '';
  final StorageService _storageService = StorageService();
  
  // Text summarization using OpenAI
  Future<String> summarizeText(String text) async {
    final response = await http.post(
      Uri.parse(AppConstants.openAiApiUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_openAiApiKey',
      },
      body: jsonEncode({
        'model': 'gpt-4',
        'messages': [
          {
            'role': 'system',
            'content': 'You are a helpful assistant that summarizes text. Provide a concise summary that captures the key points and main ideas.',
          },
          {
            'role': 'user',
            'content': text,
          },
        ],
        'max_tokens': 500,
      }),
    );
    
    if (response.statusCode != 200) {
      throw Exception('Failed to summarize text: ${response.body}');
    }
    
    final data = jsonDecode(response.body);
    return data['choices'][0]['message']['content'];
  }
  
  // Image summarization using Google Cloud Vision API and OpenAI
  Future<String> summarizeImage(File imageFile, String userId) async {
    // First, upload the image to get a URL
    final imageUrl = await _storageService.uploadSummaryImage(userId, imageFile);
    
    // Extract text from image using Google Cloud Vision API
    final visionResponse = await http.post(
      Uri.parse('${AppConstants.googleCloudVisionApiUrl}?key=$_googleCloudApiKey'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'requests': [
          {
            'image': {
              'source': {
                'imageUri': imageUrl,
              },
            },
            'features': [
              {'type': 'TEXT_DETECTION'},
              {'type': 'LABEL_DETECTION', 'maxResults': 10},
            ],
          },
        ],
      }),
    );
    
    if (visionResponse.statusCode != 200) {
      throw Exception('Failed to analyze image: ${visionResponse.body}');
    }
    
    final visionData = jsonDecode(visionResponse.body);
    
    // Extract text and labels from the response
    String extractedText = '';
    List<String> labels = [];
    
    if (visionData['responses'] != null && visionData['responses'].isNotEmpty) {
      final response = visionData['responses'][0];
      
      if (response['fullTextAnnotation'] != null) {
        extractedText = response['fullTextAnnotation']['text'] ?? '';
      }
      
      if (response['labelAnnotations'] != null) {
        labels = List<String>.from(
          response['labelAnnotations'].map((label) => label['description']),
        );
      }
    }
    
    // Combine extracted text and labels for summarization
    String prompt = 'Image contains the following elements:\n';
    if (labels.isNotEmpty) {
      prompt += 'Labels: ${labels.join(', ')}\n\n';
    }
    
    if (extractedText.isNotEmpty) {
      prompt += 'Text content:\n$extractedText\n\n';
    } else {
      prompt += 'No text detected in the image.\n\n';
    }
    
    prompt += 'Please provide a concise summary of what this image shows.';
    
    // Use OpenAI to generate a summary based on the extracted information
    final openAiResponse = await http.post(
      Uri.parse(AppConstants.openAiApiUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_openAiApiKey',
      },
      body: jsonEncode({
        'model': 'gpt-4',
        'messages': [
          {
            'role': 'system',
            'content': 'You are a helpful assistant that summarizes image content.',
          },
          {
            'role': 'user',
            'content': prompt,
          },
        ],
        'max_tokens': 300,
      }),
    );
    
    if (openAiResponse.statusCode != 200) {
      throw Exception('Failed to summarize image content: ${openAiResponse.body}');
    }
    
    final openAiData = jsonDecode(openAiResponse.body);
    return openAiData['choices'][0]['message']['content'];
  }
  
  // Video summarization (using video URL and OpenAI)
  Future<String> summarizeVideo(String videoUrl) async {
    // For video summarization, we'll use a simplified approach
    // In a production app, you would extract frames, audio, and captions
    
    // For now, we'll just ask OpenAI to generate a summary based on the video URL
    final response = await http.post(
      Uri.parse(AppConstants.openAiApiUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_openAiApiKey',
      },
      body: jsonEncode({
        'model': 'gpt-4',
        'messages': [
          {
            'role': 'system',
            'content': 'You are a helpful assistant that summarizes video content. The user will provide a video URL, and you should generate a summary of what the video might contain based on the URL. If it\'s a YouTube video, try to extract information from the video ID and any other parts of the URL.',
          },
          {
            'role': 'user',
            'content': 'Please summarize this video: $videoUrl',
          },
        ],
        'max_tokens': 500,
      }),
    );
    
    if (response.statusCode != 200) {
      throw Exception('Failed to summarize video: ${response.body}');
    }
    
    final data = jsonDecode(response.body);
    return data['choices'][0]['message']['content'];
  }
  
  // AI chatbot using OpenAI
  Future<String> getChatbotResponse(List<Map<String, String>> messages) async {
    final response = await http.post(
      Uri.parse(AppConstants.openAiApiUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_openAiApiKey',
      },
      body: jsonEncode({
        'model': 'gpt-4',
        'messages': [
          {
            'role': 'system',
            'content': 'You are a helpful AI study assistant designed to help students with their educational needs. You provide clear, concise, and accurate information. You can explain complex concepts in simple terms, help with homework, suggest study strategies, and answer questions across various subjects including math, science, history, literature, and more.',
          },
          ...messages,
        ],
        'max_tokens': 500,
      }),
    );
    
    if (response.statusCode != 200) {
      throw Exception('Failed to get chatbot response: ${response.body}');
    }
    
    final data = jsonDecode(response.body);
    return data['choices'][0]['message']['content'];
  }
  
  // Generate flashcards from text
  Future<List<Map<String, String>>> generateFlashcards(String text) async {
    final response = await http.post(
      Uri.parse(AppConstants.openAiApiUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_openAiApiKey',
      },
      body: jsonEncode({
        'model': 'gpt-4',
        'messages': [
          {
            'role': 'system',
            'content': 'You are a helpful assistant that generates flashcards from text. Each flashcard should have a question and an answer. Generate 5-10 flashcards based on the provided text. Format your response as a JSON array of objects, each with "question" and "answer" fields.',
          },
          {
            'role': 'user',
            'content': text,
          },
        ],
        'max_tokens': 1000,
      }),
    );
    
    if (response.statusCode != 200) {
      throw Exception('Failed to generate flashcards: ${response.body}');
    }
    
    final data = jsonDecode(response.body);
    final content = data['choices'][0]['message']['content'];
    
    try {
      // Parse the JSON response
      final List<dynamic> flashcardsJson = jsonDecode(content);
      return flashcardsJson.map((card) => {
        'question': card['question'],
        'answer': card['answer'],
      }).toList();
    } catch (e) {
      // If parsing fails, try to extract flashcards manually
      final List<Map<String, String>> flashcards = [];
      final regex = RegExp(r'Q:\s*(.*?)\s*A:\s*(.*?)(?=Q:|$)', dotAll: true);
      final matches = regex.allMatches(content);
      
      for (final match in matches) {
        if (match.groupCount >= 2) {
          flashcards.add({
            'question': match.group(1)?.trim() ?? '',
            'answer': match.group(2)?.trim() ?? '',
          });
        }
      }
      
      return flashcards;
    }
  }
  
  // Generate quiz questions from text
  Future<List<Map<String, dynamic>>> generateQuizQuestions(String text) async {
    final response = await http.post(
      Uri.parse(AppConstants.openAiApiUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_openAiApiKey',
      },
      body: jsonEncode({
        'model': 'gpt-4',
        'messages': [
          {
            'role': 'system',
            'content': 'You are a helpful assistant that generates multiple-choice quiz questions from text. Generate 5 quiz questions based on the provided text. Each question should have 4 options with one correct answer. Format your response as a JSON array of objects, each with "question", "options" (array of strings), and "correctIndex" (integer) fields.',
          },
          {
            'role': 'user',
            'content': text,
          },
        ],
        'max_tokens': 1000,
      }),
    );
    
    if (response.statusCode != 200) {
      throw Exception('Failed to generate quiz questions: ${response.body}');
    }
    
    final data = jsonDecode(response.body);
    final content = data['choices'][0]['message']['content'];
    
    try {
      // Parse the JSON response
      final List<dynamic> questionsJson = jsonDecode(content);
      return questionsJson.map((q) => {
        'question': q['question'],
        'options': q['options'],
        'correctIndex': q['correctIndex'],
      }).toList();
    } catch (e) {
      // If parsing fails, return an empty list
      return [];
    }
  }
}

