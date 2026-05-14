"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import Sidebar from "@/components/layout/Sidebar"

import { useAuthStore } from "@/lib/store/auth"

import { useHydration } from "@/lib/hooks/useHydration"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const hydrated =
    useHydration()

  const user = useAuthStore(
    (state) => state.user
  )

  useEffect(() => {
    if (
      hydrated &&
      !user
    ) {
      router.push("/login")
    }
  }, [
    hydrated,
    user,
    router,
  ])

  /*
  |--------------------------------------------------------------------------
  | WAIT FOR CLIENT HYDRATION
  |--------------------------------------------------------------------------
  */

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | PREVENT FLASH
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}