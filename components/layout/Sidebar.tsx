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
} from "lucide-react"

import { useAuthStore } from "@/lib/store/auth"

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
    <aside className="flex w-64 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">
          RoboticSir CRM
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {user?.email}
        </p>
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
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
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
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
              pathname === "/users"
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
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
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
              pathname === "/settings/custom-fields"
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Settings size={18} />
            Custom Fields
          </Link>
        )}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={18} />

          Logout
        </button>
      </div>
    </aside>
  )
}