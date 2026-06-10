import apiClient from "@/lib/api/client"

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  )
}

export async function getPermissionState(): Promise<NotificationPermission> {
  if (!isPushSupported()) return "denied"
  return Notification.permission
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) return null
  try {
    return await navigator.serviceWorker.register("/sw.js")
  } catch {
    console.error("Service worker registration failed")
    return null
  }
}

export async function subscribeToPush(
  vapidPublicKey: string
): Promise<boolean> {
  try {
    const registration = await registerServiceWorker()
    if (!registration) return false

    const permission = await Notification.requestPermission()
    if (permission !== "granted") return false

    const existing = await registration.pushManager.getSubscription()
    if (existing) {
      await sendSubscriptionToServer(existing)
      return true
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey).buffer as ArrayBuffer,
    })

    await sendSubscriptionToServer(subscription)
    return true
  } catch (err) {
    console.error("Push subscription failed:", err)
    return false
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) return true

    await apiClient.delete("/users/push/subscribe/", {
      data: { endpoint: subscription.endpoint },
    })

    await subscription.unsubscribe()
    return true
  } catch (err) {
    console.error("Push unsubscribe failed:", err)
    return false
  }
}

export async function isCurrentlySubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return !!subscription
  } catch {
    return false
  }
}

async function sendSubscriptionToServer(
  subscription: PushSubscription
): Promise<void> {
  const key = subscription.getKey("p256dh")
  const auth = subscription.getKey("auth")

  await apiClient.post("/users/push/subscribe/", {
    endpoint: subscription.endpoint,
    p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : "",
    auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : "",
  })
}
