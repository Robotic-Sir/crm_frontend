"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Users,
  Megaphone,
  Upload,
  Shield,
  LogOut,
  Settings,
  User,
} from "lucide-react"

import { useAuthStore } from "@/lib/store/auth"
import NotificationBell from "@/components/layout/NotificationBell"

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Leads",
    href: "/leads",
    icon: Users,
  },

  {
    label: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
  },

  {
    label: "Bulk Upload",
    href: "/imports",
    icon: Upload,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const logout = useAuthStore(
    (state) => state.logout
  )

  const user = useAuthStore(
    (state) => state.user
  )

  return (
    <aside className="flex w-64 flex-col bg-[#1e1b4b]">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              RoboticSir
            </h1>
            <p className="text-xs text-indigo-300 leading-tight">
              CRM Platform
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon

          const active =
            pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border-l-2 border-indigo-300"
                  : "text-indigo-200 hover:bg-indigo-800/50 hover:text-white"
              }`}
            >
              <Icon size={18} />

              {link.label}
            </Link>
          )
        })}

        {user?.role ===
          "superadmin" && (
          <Link
            href="/users"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              pathname === "/users"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border-l-2 border-indigo-300"
                : "text-indigo-200 hover:bg-indigo-800/50 hover:text-white"
            }`}
          >
            <Shield size={18} />
            Users
          </Link>
        )}

        {(user?.role === "superadmin" ||
          user?.role === "admin") && (
          <Link
            href="/settings/custom-fields"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              pathname === "/settings/custom-fields"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border-l-2 border-indigo-300"
                : "text-indigo-200 hover:bg-indigo-800/50 hover:text-white"
            }`}
          >
            <Settings size={18} />
            Custom Fields
          </Link>
        )}
      </nav>

      <div className="border-t border-white/10 p-4 space-y-1">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
            <User size={14} />
          </div>
          <div className="min-w-0">
            {(user?.first_name || user?.last_name) && (
              <p className="truncate text-sm font-medium text-white">
                {[user.first_name, user.last_name].filter(Boolean).join(" ")}
              </p>
            )}
            <p className="truncate text-xs text-indigo-300">
              {user?.email}
            </p>
          </div>
        </div>

        <NotificationBell />

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
