"use client"

import type React from "react"
import { createContext, useState, useContext, useRef } from "react"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toasts: ToastMessage[]
  showToast: (message: string, type: ToastType) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const toastIdCounter = useRef(0)

  const showToast = (message: string, type: ToastType = "info") => {
    const id = `toast-${toastIdCounter.current++}`
    const newToast = { id, message, type }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      hideToast(id)
    }, 3000)
  }

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  const value = {
    toasts,
    showToast,
    hideToast,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

