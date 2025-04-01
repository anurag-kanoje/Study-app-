import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:ai_study_companion/providers/auth_provider.dart';
import 'package:ai_study_companion/providers/notes_provider.dart';
import 'package:ai_study_companion/providers/summary_provider.dart';
import 'package:ai_study_companion/widgets/note_card.dart';
import 'package:ai_study_companion/widgets/summary_card.dart';
import 'package:ai_study_companion/widgets/custom_button.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (authProvider.user != null) {
      final notesProvider = Provider.of<NotesProvider>(context, listen: false);
      final summaryProvider = Provider.of<SummaryProvider>(context, listen: false);
      
      await Future.wait([
        notesProvider.fetchNotes(authProvider.user!.id),
        summaryProvider.fetchSummaries(authProvider.user!.id),
      ]);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final notesProvider = Provider.of<NotesProvider>(context);
    final summaryProvider = Provider.of<SummaryProvider>(context);
    final theme = Theme.of(context);
    
    if (authProvider.isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    
    if (authProvider.user == null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Please sign in to continue',
                style: TextStyle(
                  fontSize: 18,
                  color: theme.colorScheme.onBackground,
                ),
              ),
              const SizedBox(height: 16),
              CustomButton(
                text: 'Sign In',
                onPressed: () {
                  context.go('/auth/login');
                },
              ),
            ],
          ),
        ),
      );
    }
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome section
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 24,
                            backgroundColor: theme.colorScheme.primary,
                            child: Text(
                              authProvider.user!.name?.isNotEmpty == true
                                  ? authProvider.user!.name![0].toUpperCase()
                                  : 'U',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: theme.colorScheme.onPrimary,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Welcome back,',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: theme.colorScheme.onBackground.withOpacity(0.7),
                                  ),
                                ),
                                Text(
                                  authProvider.user!.name ?? 'User',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: theme.colorScheme.onBackground,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Your Study Stats',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.onBackground,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: _buildStatCard(
                              context,
                              title: 'Notes',
                              value: notesProvider.notes.length.toString(),
                              icon: Icons.note_alt_outlined,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildStatCard(
                              context,
                              title: 'Summaries',
                              value: summaryProvider.summaries.length.toString(),
                              icon: Icons.summarize_outlined,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildStatCard(
                              context,
                              title: 'Study Time',
                              value: '2.5h',
                              icon: Icons.timer_outlined,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Quick actions
              Text(
                'Quick Actions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.onBackground,
                ),
              ),
              const SizedBox(height: 12),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildActionCard(
                      context,
                      title: 'New Note',
                      icon: Icons.note_add_outlined,
                      color: Colors.blue,
                      onTap: () {
                        context.go('/notes/create');
                      },
                    ),
                    _buildActionCard(
                      context,
                      title: 'Summarize Text',
                      icon: Icons.text_snippet_outlined,
                      color: Colors.green,
                      onTap: () {
                        context.go('/summarize/text');
                      },
                    ),
                    _buildActionCard(
                      context,
                      title: 'Summarize Image',
                      icon: Icons.image_outlined,
                      color: Colors.purple,
                      onTap: () {
                        context.go('/summarize/image');
                      },
                    ),
                    _buildActionCard(
                      context,
                      title: 'Summarize Video',
                      icon: Icons.video_library_outlined,
                      color: Colors.red,
                      onTap: () {
                        context.go('/summarize/video');
                      },
                    ),
                    _buildActionCard(
                      context,
                      title: 'Ask AI',
                      icon: Icons.chat_outlined,
                      color: Colors.orange,
                      onTap: () {
                        context.go('/chatbot');
                      },
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Recent notes
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Recent Notes',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.onBackground,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      context.go('/notes');
                    },
                    child: const Text('View All'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              notesProvider.notes.isEmpty
                  ? _buildEmptyState(
                      context,
                      message: 'You haven\'t created any notes yet',
                      buttonText: 'Create Note',
                      onPressed: () {
                        context.go('/notes/create');
                      },
                    )
                  : ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: notesProvider.notes.length > 3
                          ? 3
                          : notesProvider.notes.length,
                      itemBuilder: (context, index) {
                        final note = notesProvider.notes[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: NoteCard(
                            note: note,
                            onTap: () {
                              context.go('/notes/${note.id}');
                            },
                          ),
                        );
                      },
                    ),
              
              const SizedBox(height: 24),
              
              // Recent summaries
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Recent Summaries',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.onBackground,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      context.go('/summarize');
                    },
                    child: const Text('View All'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              summaryProvider.summaries.isEmpty
                  ? _buildEmptyState(
                      context,
                      message: 'You haven\'t created any summaries yet',
                      buttonText: 'Create Summary',
                      onPressed: () {
                        context.go('/summarize');
                      },
                    )
                  : ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: summaryProvider.summaries.length > 3
                          ? 3
                          : summaryProvider.summaries.length,
                      itemBuilder: (context, index) {
                        final summary = summaryProvider.summaries[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: SummaryCard(
                            summary: summary,
                            onTap: () {
                              // Navigate to summary detail
                            },
                          ),
                        );
                      },
                    ),
              
              const SizedBox(height: 24),
              
              // Study tips
              Text(
                'Study Tips',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.onBackground,
                ),
              ),
              const SizedBox(height: 12),
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.lightbulb_outline,
                            color: Colors.amber,
                            size: 24,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Tip of the Day',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.onBackground,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break of 15-30 minutes.',
                        style: TextStyle(
                          fontSize: 14,
                          color: theme.colorScheme.onBackground.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
  }) {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.brightness == Brightness.light
            ? Colors.grey[100]
            : Colors.grey[800],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(
            icon,
            color: theme.colorScheme.primary,
            size: 24,
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onBackground,
            ),
          ),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: theme.colorScheme.onBackground.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    
    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: 100,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: color.withOpacity(0.3),
              width: 1,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                color: color,
                size: 32,
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.onBackground,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState(
    BuildContext context, {
    required String message,
    required String buttonText,
    required VoidCallback onPressed,
  }) {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: theme.brightness == Brightness.light
            ? Colors.grey[100]
            : Colors.grey[800],
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            message,
            style: TextStyle(
              fontSize: 16,
              color: theme.colorScheme.onBackground.withOpacity(0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          CustomButton(
            text: buttonText,
            onPressed: onPressed,
            type: ButtonType.primary,
            size: ButtonSize.small,
          ),
        ],
      ),
    );
  }
}

