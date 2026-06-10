"use client"

import {
  Users,
  UserPlus,
  TrendingUp,
  Bell,
  AlertTriangle,
  CalendarClock,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/lib/store/auth"
import { useDashboard } from "@/hooks/use-dashboard"
import { getStatusLabel } from "@/lib/constants/leads"

const PIE_COLORS = [
  "#3b82f6",
  "#eab308",
  "#06b6d4",
  "#ef4444",
  "#f97316",
  "#8b5cf6",
  "#6366f1",
  "#22c55e",
  "#64748b",
  "#9ca3af",
]

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { data, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const statusData = Object.entries(data.status_breakdown).map(
    ([key, value]) => ({
      name: getStatusLabel(key),
      value,
      key,
    })
  )

  const sourceData = Object.entries(data.source_breakdown).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      count: value,
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back,{" "}
          <span className="font-medium text-slate-900">
            {user?.first_name || user?.email}
          </span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={data.total_leads}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={UserPlus}
          label="New Today"
          value={data.today_new_leads}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          icon={TrendingUp}
          label="Conversion Rate"
          value={`${data.conversion_rate}%`}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <StatCard
          icon={Bell}
          label="Pending Reminders"
          value={data.reminders.pending}
          color="text-yellow-600"
          bg="bg-yellow-50"
          extra={
            data.reminders.overdue > 0 ? (
              <span className="flex items-center gap-1 text-xs text-red-600">
                <AlertTriangle size={12} />
                {data.reminders.overdue} overdue
              </span>
            ) : null
          }
        />
      </div>

      {/* Reminder summary strip */}
      {data.reminders.today > 0 && (
        <Card className="flex items-center gap-3 rounded-2xl border-yellow-200 bg-yellow-50 p-4">
          <CalendarClock size={20} className="text-yellow-600" />
          <p className="text-sm">
            You have <span className="font-semibold">{data.reminders.today}</span>{" "}
            reminder{data.reminders.today > 1 ? "s" : ""} due today
          </p>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Breakdown Pie */}
        <Card className="rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Lead Status Breakdown</h2>
          {statusData.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No data</p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5">
                {statusData.map((entry, i) => (
                    <div key={entry.key} className="flex items-center gap-2 text-sm">
                      <span
                        className="inline-block h-3 w-3 rounded-sm"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="text-slate-600">{entry.name}</span>
                      <span className="font-medium">{entry.value}</span>
                    </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Source Breakdown Bar */}
        <Card className="rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Leads by Source</h2>
          {sourceData.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sourceData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <div className="space-y-1">
          {data.recent_activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No recent activity</p>
          ) : (
            data.recent_activities.map((activity, i) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="mt-2 h-2 w-2 rounded-full bg-slate-300" />
                  {i < data.recent_activities.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-slate-400">
                    {activity.user_name} &middot;{" "}
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  extra,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string | number
  color: string
  bg: string
  extra?: React.ReactNode
}) {
  return (
    <Card className="flex items-center gap-4 rounded-2xl p-5">
      <div className={`rounded-xl p-3 ${bg}`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {extra}
      </div>
    </Card>
  )
}
