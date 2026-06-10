"use client"

import { useState, useEffect, useCallback } from "react"
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  isCurrentlySubscribed,
  registerServiceWorker,
} from "@/lib/push-notifications"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""

export function usePushNotifications() {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    const check = async () => {
      const sup = isPushSupported()
      setSupported(sup)
      if (sup) {
        setPermission(Notification.permission)
        await registerServiceWorker()
        const sub = await isCurrentlySubscribed()
        setSubscribed(sub)
      }
      setLoading(false)
    }
    check()
  }, [])

  const subscribe = useCallback(async () => {
    if (!VAPID_PUBLIC_KEY) {
      console.error("NEXT_PUBLIC_VAPID_PUBLIC_KEY not set")
      return false
    }
    setLoading(true)
    const success = await subscribeToPush(VAPID_PUBLIC_KEY)
    setSubscribed(success)
    if (success) setPermission("granted")
    setLoading(false)
    return success
  }, [])

  const unsubscribe = useCallback(async () => {
    setLoading(true)
    const success = await unsubscribeFromPush()
    if (success) setSubscribed(false)
    setLoading(false)
    return success
  }, [])

  return {
    supported,
    subscribed,
    loading,
    permission,
    subscribe,
    unsubscribe,
  }
}
