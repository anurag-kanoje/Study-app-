"use client"
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native"
import { useToast } from "../../context/ToastContext"
import { useTheme } from "../../context/ThemeContext"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react-native"

const Toast = () => {
  const { toasts, hideToast } = useToast()
  const { colors } = useTheme()

  if (toasts.length === 0) return null

  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} color={colors.success} />
      case "error":
        return <AlertCircle size={20} color={colors.destructive} />
      case "warning":
        return <AlertTriangle size={20} color={colors.warning} />
      case "info":
      default:
        return <Info size={20} color={colors.info} />
    }
  }

  const getToastBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return colors.success + "10" // 10% opacity
      case "error":
        return colors.destructive + "10"
      case "warning":
        return colors.warning + "10"
      case "info":
      default:
        return colors.info + "10"
    }
  }

  const getToastBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return colors.success
      case "error":
        return colors.destructive
      case "warning":
        return colors.warning
      case "info":
      default:
        return colors.info
    }
  }

  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <Animated.View
          key={toast.id}
          style={[
            styles.toast,
            {
              backgroundColor: getToastBackgroundColor(toast.type),
              borderColor: getToastBorderColor(toast.type),
              borderLeftWidth: 4,
            },
          ]}
        >
          <View style={styles.iconContainer}>{getToastIcon(toast.type)}</View>
          <Text style={[styles.message, { color: colors.text }]}>{toast.message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => hideToast(toast.id)}>
            <X size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  closeButton: {
    padding: 4,
  },
})

export default Toast

