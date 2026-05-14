"use client"

import { useAuthStore } from "@/lib/store/auth"

import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  const user = useAuthStore(
    (state) => state.user
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back,{" "}
          <span className="font-medium text-slate-900">
            {user?.first_name ||
              user?.email}
          </span>
        </p>
      </div>

      <Card className="rounded-2xl p-6">
        <h2 className="text-lg font-semibold">
          System Status
        </h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <span>
              Authentication
            </span>

            <span className="font-medium text-green-600">
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <span>
              Logged in user
            </span>

            <span className="font-medium">
              {user?.email}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <span>User role</span>

            <span className="font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}