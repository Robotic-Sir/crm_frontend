"use client"

import { Bell, BellOff, BellRing, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import toast from "react-hot-toast"

export default function NotificationBell() {
  const { supported, subscribed, loading, permission, subscribe, unsubscribe } =
    usePushNotifications()

  if (!supported) return null

  async function handleToggle() {
    if (subscribed) {
      const success = await unsubscribe()
      if (success) toast.success("Notifications disabled")
      else toast.error("Failed to disable notifications")
    } else {
      if (permission === "denied") {
        toast.error("Notifications blocked — enable them in browser settings")
        return
      }
      const success = await subscribe()
      if (success) toast.success("Notifications enabled")
      else toast.error("Failed to enable notifications")
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleToggle}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : subscribed ? (
        <BellRing size={18} className="text-green-600" />
      ) : (
        <BellOff size={18} className="text-slate-400" />
      )}
      {subscribed ? "Notifications On" : "Enable Notifications"}
    </Button>
  )
}
