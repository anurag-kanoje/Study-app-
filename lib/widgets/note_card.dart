import 'package:flutter/material.dart';
import 'package:ai_study_companion/models/note_model.dart';
import 'package:timeago/timeago.dart' as timeago;

class NoteCard extends StatelessWidget {
  final NoteModel note;
  final VoidCallback? onTap;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onFavoriteToggle;
  
  const NoteCard({
    Key? key,
    required this.note,
    this.onTap,
    this.onEdit,
    this.onDelete,
    this.onFavoriteToggle,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Get category color
    Color categoryColor;
    switch (note.category) {
      case NoteCategory.math:
        categoryColor = Colors.blue;
        break;
      case NoteCategory.science:
        categoryColor = Colors.green;
        break;
      case NoteCategory.language:
        categoryColor = Colors.purple;
        break;
      case NoteCategory.history:
        categoryColor = Colors.orange;
        break;
      case NoteCategory.other:
        categoryColor = Colors.teal;
        break;
      case NoteCategory.general:
      default:
        categoryColor = Colors.grey;
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
                  Expanded(
                    child: Text(
                      note.title,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.onSurface,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (onFavoriteToggle != null)
                    IconButton(
                      icon: Icon(
                        note.isFavorite ? Icons.favorite : Icons.favorite_border,
                        color: note.isFavorite ? Colors.red : Colors.grey,
                      ),
                      onPressed: onFavoriteToggle,
                      tooltip: note.isFavorite ? 'Remove from favorites' : 'Add to favorites',
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: categoryColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  note.category.toString().split('.').last,
                  style: TextStyle(
                    fontSize: 12,
                    color: categoryColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                note.content,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 14,
                  color: theme.colorScheme.onSurface.withOpacity(0.8),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Updated ${timeago.format(note.updatedAt)}',
                    style: TextStyle(
                      fontSize: 12,
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                  Row(
                    children: [
                      if (onEdit != null)
                        IconButton(
                          icon: const Icon(Icons.edit_outlined, size: 20),
                          onPressed: onEdit,
                          tooltip: 'Edit Note',
                          constraints: const BoxConstraints(),
                          padding: const EdgeInsets.all(4),
                          color: theme.colorScheme.primary,
                        ),
                      if (onDelete != null)
                        IconButton(
                          icon: const Icon(Icons.delete_outline, size: 20),
                          onPressed: onDelete,
                          tooltip: 'Delete Note',
                          constraints: const BoxConstraints(),
                          padding: const EdgeInsets.all(4),
                          color: theme.colorScheme.error,
                        ),
                    ],
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

