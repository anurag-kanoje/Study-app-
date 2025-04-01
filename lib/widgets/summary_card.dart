import 'package:flutter/material.dart';
import 'package:ai_study_companion/models/summary_model.dart';
import 'package:timeago/timeago.dart' as timeago;

class SummaryCard extends StatelessWidget {
  final SummaryModel summary;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;
  
  const SummaryCard({
    Key? key,
    required this.summary,
    this.onTap,
    this.onDelete,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Determine icon based on summary type
    IconData typeIcon;
    String typeText;
    
    switch (summary.type) {
      case SummaryType.image:
        typeIcon = Icons.image;
        typeText = 'Image Summary';
        break;
      case SummaryType.video:
        typeIcon = Icons.video_library;
        typeText = 'Video Summary';
        break;
      case SummaryType.text:
      default:
        typeIcon = Icons.text_snippet;
        typeText = 'Text Summary';
        break;
    }
    
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    typeIcon,
                    color: theme.colorScheme.primary,
                    size: 24,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    typeText,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const Spacer(),
                  if (onDelete != null)
                    IconButton(
                      icon: const Icon(Icons.delete_outline),
                      onPressed: onDelete,
                      color: theme.colorScheme.error,
                      tooltip: 'Delete Summary',
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                summary.summaryContent,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 14,
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    timeago.format(summary.createdAt),
                    style: TextStyle(
                      fontSize: 12,
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                  if (onTap != null)
                    Text(
                      'View Details',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

