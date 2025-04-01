import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:ai_study_companion/core/router.dart';
import 'package:ai_study_companion/core/theme.dart';
import 'package:ai_study_companion/providers/auth_provider.dart';
import 'package:ai_study_companion/providers/theme_provider.dart';
import 'package:ai_study_companion/providers/notes_provider.dart';
import 'package:ai_study_companion/providers/summary_provider.dart';
import 'package:ai_study_companion/providers/chatbot_provider.dart';
import 'package:ai_study_companion/providers/parental_control_provider.dart';

class StudyCompanionApp extends StatelessWidget {
  const StudyCompanionApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => NotesProvider()),
        ChangeNotifierProvider(create: (_) => SummaryProvider()),
        ChangeNotifierProvider(create: (_) => ChatbotProvider()),
        ChangeNotifierProvider(create: (_) => ParentalControlProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return MaterialApp.router(
            title: 'AI Study Companion',
            theme: lightTheme,
            darkTheme: darkTheme,
            themeMode: themeProvider.themeMode,
            routerConfig: appRouter,
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }
}

