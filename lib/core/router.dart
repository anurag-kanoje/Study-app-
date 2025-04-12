import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:ai_study_companion/screens/auth/login_screen.dart';
import 'package:ai_study_companion/screens/auth/signup_screen.dart';
import 'package:ai_study_companion/screens/auth/role_selection_screen.dart';
import 'package:ai_study_companion/screens/dashboard/dashboard_screen.dart';
import 'package:ai_study_companion/screens/notes/notes_screen.dart';
import 'package:ai_study_companion/screens/notes/note_detail_screen.dart';
import 'package:ai_study_companion/screens/notes/create_edit_note_screen.dart';
import 'package:ai_study_companion/screens/summarization/text_summary_screen.dart';
import 'package:ai_study_companion/screens/summarization/image_summary_screen.dart';
import 'package:ai_study_companion/screens/summarization/video_summary_screen.dart';
import 'package:ai_study_companion/screens/chatbot/chatbot_screen.dart';
import 'package:ai_study_companion/screens/settings/settings_screen.dart';
import 'package:ai_study_companion/screens/parental/parental_dashboard_screen.dart';
import 'package:ai_study_companion/screens/splash_screen.dart';
import 'package:ai_study_companion/screens/error_screen.dart';
import 'package:ai_study_companion/services/auth_service.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final appRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/',
  debugLogDiagnostics: true,
  redirect: (context, state) async {
    final authService = AuthService();
    final isLoggedIn = await authService.isAuthenticated();
    
    // If the user is not logged in and not on an auth route, redirect to login
    final isGoingToAuth = state.matchedLocation.startsWith('/auth');
    if (!isLoggedIn && !isGoingToAuth && state.matchedLocation != '/') {
      return '/auth/login';
    }
    
    // If the user is logged in and going to auth, redirect to dashboard
    if (isLoggedIn && isGoingToAuth) {
      return '/dashboard';
    }
    
    return null;
  },
  routes: [
    // Splash screen
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    
    // Auth routes
    GoRoute(
      path: '/auth/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/auth/signup',
      builder: (context, state) => const SignupScreen(),
    ),
    GoRoute(
      path: '/auth/role-selection',
      builder: (context, state) => const RoleSelectionScreen(),
    ),
    
    // Main app shell with bottom navigation
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) {
        return ScaffoldWithBottomNavBar(child: child);
      },
      routes: [
        // Dashboard
        GoRoute(
          path: '/dashboard',
          builder: (context, state) => const DashboardScreen(),
          routes: [
            // Nested routes for dashboard if needed
          ],
        ),
        
        // Notes
        GoRoute(
          path: '/notes',
          builder: (context, state) => const NotesScreen(),
          routes: [
            GoRoute(
              path: 'create',
              builder: (context, state) => const CreateEditNoteScreen(),
            ),
            GoRoute(
              path: 'edit/:id',
              builder: (context, state) => CreateEditNoteScreen(
                noteId: state.pathParameters['id'],
              ),
            ),
            GoRoute(
              path: ':id',
              builder: (context, state) => NoteDetailScreen(
                noteId: state.pathParameters['id'] ?? '',
              ),
            ),
          ],
        ),
        
        // Summarization
        GoRoute(
          path: '/summarize',
          builder: (context, state) => const TextSummaryScreen(),
          routes: [
            GoRoute(
              path: 'text',
              builder: (context, state) => const TextSummaryScreen(),
            ),
            GoRoute(
              path: 'image',
              builder: (context, state) => const ImageSummaryScreen(),
            ),
            GoRoute(
              path: 'video',
              builder: (context, state) => const VideoSummaryScreen(),
            ),
          ],
        ),
        
        // Chatbot
        GoRoute(
          path: '/chatbot',
          builder: (context, state) => const ChatbotScreen(),
        ),
        
        // Settings
        GoRoute(
          path: '/settings',
          builder: (context, state) => const SettingsScreen(),
        ),
      ],
    ),
    
    // Parental Dashboard (separate from main shell)
    GoRoute(
      path: '/parental-dashboard',
      builder: (context, state) => const ParentalDashboardScreen(),
    ),
    
    // Error screen
    GoRoute(
      path: '/error',
      builder: (context, state) => ErrorScreen(
        errorMessage: state.queryParameters['message'] ?? 'An error occurred',
      ),
    ),
  ],
  errorBuilder: (context, state) => ErrorScreen(
    errorMessage: state.error?.toString() ?? 'Page not found',
  ),
);

// Scaffold with bottom navigation bar for shell route
class ScaffoldWithBottomNavBar extends StatelessWidget {
  final Widget child;
  
  const ScaffoldWithBottomNavBar({
    Key? key,
    required this.child,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _calculateSelectedIndex(context),
        onTap: (index) => _onItemTapped(index, context),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.note),
            label: 'Notes',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.summarize),
            label: 'Summarize',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat),
            label: 'Chatbot',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
  
  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith('/dashboard')) {
      return 0;
    }
    if (location.startsWith('/notes')) {
      return 1;
    }
    if (location.startsWith('/summarize')) {
      return 2;
    }
    if (location.startsWith('/chatbot')) {
      return 3;
    }
    if (location.startsWith('/settings')) {
      return 4;
    }
    return 0;
  }
  
  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        GoRouter.of(context).go('/dashboard');
        break;
      case 1:
        GoRouter.of(context).go('/notes');
        break;
      case 2:
        GoRouter.of(context).go('/summarize');
        break;
      case 3:
        GoRouter.of(context).go('/chatbot');
        break;
      case 4:
        GoRouter.of(context).go('/settings');
        break;
    }
  }
}

