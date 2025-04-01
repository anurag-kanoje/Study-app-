interface Window {
  OneSignal?: {
    init: (config: any) => void
    getNotificationPermission: () => Promise<string>
    setSubscription: (state: boolean) => Promise<void>
    sendSelfNotification: (title: string, message: string, url: string, icon: string, data: any) => Promise<void>
  }
}

