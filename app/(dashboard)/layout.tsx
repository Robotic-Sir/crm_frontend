"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import Sidebar from "@/components/layout/Sidebar"
import MobileNav from "@/components/layout/MobileNav"

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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Sidebar />
      <MobileNav />

      <main className="min-w-0 flex-1 overflow-auto px-4 pb-24 pt-20 sm:px-6 lg:border-t lg:border-slate-200 lg:p-8">
        <div className="mx-auto w-full max-w-[1600px]">{children}</div>
      </main>
    </div>
  )
}
