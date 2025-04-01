"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  type TextInputProps as RNTextInputProps,
  type ViewStyle,
  type TextStyle,
  TouchableOpacity,
} from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { Eye, EyeOff } from "lucide-react-native"

interface TextInputProps extends RNTextInputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  inputStyle?: TextStyle
  errorStyle?: TextStyle
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  ...props
}) => {
  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: error ? colors.destructive : colors.text }, labelStyle]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.destructive : isFocused ? colors.primary : colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <RNTextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 0 : 12,
              paddingRight: rightIcon || secureTextEntry ? 0 : 12,
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.mutedForeground}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity style={styles.iconContainer} onPress={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <EyeOff size={20} color={colors.mutedForeground} />
            ) : (
              <Eye size={20} color={colors.mutedForeground} />
            )}
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {error && <Text style={[styles.errorText, { color: colors.destructive }, errorStyle]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: "Inter-Medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 8,
    fontFamily: "Inter-Regular",
    fontSize: 16,
  },
  iconContainer: {
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Inter-Regular",
  },
})

export default TextInput

