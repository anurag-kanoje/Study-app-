import 'package:flutter/material.dart';

enum ButtonType { primary, secondary, outline, text }
enum ButtonSize { small, medium, large }

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonType type;
  final ButtonSize size;
  final IconData? icon;
  final bool isLoading;
  final bool fullWidth;
  
  const CustomButton({
    Key? key,
    required this.text,
    this.onPressed,
    this.type = ButtonType.primary,
    this.size = ButtonSize.medium,
    this.icon,
    this.isLoading = false,
    this.fullWidth = false,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Define styles based on button type
    Color backgroundColor;
    Color textColor;
    Color borderColor;
    
    switch (type) {
      case ButtonType.primary:
        backgroundColor = theme.colorScheme.primary;
        textColor = theme.colorScheme.onPrimary;
        borderColor = Colors.transparent;
        break;
      case ButtonType.secondary:
        backgroundColor = theme.colorScheme.secondary;
        textColor = theme.colorScheme.onSecondary;
        borderColor = Colors.transparent;
        break;
      case ButtonType.outline:
        backgroundColor = Colors.transparent;
        textColor = theme.colorScheme.primary;
        borderColor = theme.colorScheme.primary;
        break;
      case ButtonType.text:
        backgroundColor = Colors.transparent;
        textColor = theme.colorScheme.primary;
        borderColor = Colors.transparent;
        break;
    }
    
    // Define padding based on button size
    EdgeInsets padding;
    double fontSize;
    double iconSize;
    
    switch (size) {
      case ButtonSize.small:
        padding = const EdgeInsets.symmetric(horizontal: 12, vertical: 8);
        fontSize = 14;
        iconSize = 16;
        break;
      case ButtonSize.large:
        padding = const EdgeInsets.symmetric(horizontal: 24, vertical: 16);
        fontSize = 18;
        iconSize = 24;
        break;
      case ButtonSize.medium:
      default:
        padding = const EdgeInsets.symmetric(horizontal: 16, vertical: 12);
        fontSize = 16;
        iconSize = 20;
        break;
    }
    
    final buttonContent = Row(
      mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading)
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: SizedBox(
              width: iconSize,
              height: iconSize,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(textColor),
              ),
            ),
          )
        else if (icon != null)
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: Icon(icon, size: iconSize, color: textColor),
          ),
        Text(
          text,
          style: TextStyle(
            color: textColor,
            fontSize: fontSize,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
    
    return Container(
      width: fullWidth ? double.infinity : null,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: textColor,
          padding: padding,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: BorderSide(color: borderColor),
          ),
          elevation: type == ButtonType.text || type == ButtonType.outline ? 0 : 2,
        ),
        child: buttonContent,
      ),
    );
  }
}

