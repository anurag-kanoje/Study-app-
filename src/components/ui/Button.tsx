"use client"

import React from "react"
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
  type ViewStyle,
  type TextStyle,
} from "react-native"
import { useTheme } from "../../context/ThemeContext"

type ButtonVariant = "default" | "outline" | "ghost" | "link" | "destructive"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  children,
  disabled,
  ...props
}) => {
  const { colors } = useTheme()

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    }

    // Size styles
    switch (size) {
      case "sm":
        baseStyle.paddingHorizontal = 12
        baseStyle.paddingVertical = 6
        break
      case "lg":
        baseStyle.paddingHorizontal = 20
        baseStyle.paddingVertical = 12
        break
      default: // md
        baseStyle.paddingHorizontal = 16
        baseStyle.paddingVertical = 10
        break
    }

    // Variant styles
    switch (variant) {
      case "outline":
        baseStyle.backgroundColor = "transparent"
        baseStyle.borderWidth = 1
        baseStyle.borderColor = colors.border
        break
      case "ghost":
        baseStyle.backgroundColor = "transparent"
        break
      case "link":
        baseStyle.backgroundColor = "transparent"
        baseStyle.paddingHorizontal = 0
        baseStyle.paddingVertical = 0
        break
      case "destructive":
        baseStyle.backgroundColor = colors.destructive
        break
      default: // default
        baseStyle.backgroundColor = colors.primary
        break
    }

    // Disabled state
    if (disabled || isLoading) {
      baseStyle.opacity = 0.5
    }

    return baseStyle
  }

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: "Inter-Medium",
    }

    // Size styles
    switch (size) {
      case "sm":
        baseStyle.fontSize = 14
        break
      case "lg":
        baseStyle.fontSize = 18
        break
      default: // md
        baseStyle.fontSize = 16
        break
    }

    // Variant styles
    switch (variant) {
      case "outline":
        baseStyle.color = colors.primary
        break
      case "ghost":
        baseStyle.color = colors.primary
        break
      case "link":
        baseStyle.color = colors.primary
        baseStyle.textDecorationLine = "underline"
        break
      case "destructive":
        baseStyle.color = colors.destructiveForeground
        break
      default: // default
        baseStyle.color = colors.primaryForeground
        break
    }

    return baseStyle
  }

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === "default" ? colors.primaryForeground : colors.primary} />
      ) : (
        <>
          {leftIcon && <React.Fragment>{leftIcon}</React.Fragment>}
          {typeof children === "string" ? (
            <Text style={[getTextStyles(), textStyle, leftIcon && { marginLeft: 8 }, rightIcon && { marginRight: 8 }]}>
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon && <React.Fragment>{rightIcon}</React.Fragment>}
        </>
      )}
    </TouchableOpacity>
  )
}

export default Button

