"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  Shield,
  Upload,
  Users,
} from "lucide-react"

import { useAuthStore } from "@/lib/store/auth"
import NotificationBell from "@/components/layout/NotificationBell"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const mainLinks = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Imports", href: "/imports", icon: Upload },
]

export default function MobileNav() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="lg:hidden">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg shadow-md">🤖</div>
          <div>
            <p className="font-bold leading-tight text-slate-900">RoboticSir</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-indigo-600">CRM workspace</p>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <NotificationBell compact />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] max-w-sm p-0">
              <SheetHeader className="border-b p-5">
                <SheetTitle>Workspace menu</SheetTitle>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </SheetHeader>
              <nav className="space-y-1 p-4">
                {(user?.role === "admin" || user?.role === "superadmin") && (
                  <SheetClose asChild>
                    <Link href="/settings/custom-fields" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-slate-100"><Settings className="h-5 w-5 text-indigo-600" />Custom fields</Link>
                  </SheetClose>
                )}
                {user?.role === "superadmin" && (
                  <SheetClose asChild>
                    <Link href="/users" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-slate-100"><Shield className="h-5 w-5 text-indigo-600" />Team & users</Link>
                  </SheetClose>
                )}
                <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut className="h-5 w-5" />Logout</button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-18 grid-cols-4 border-t border-slate-200/80 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        {mainLinks.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link key={link.href} href={link.href} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${active ? "text-indigo-700" : "text-slate-500"}`}>
              <span className={`rounded-xl p-1.5 ${active ? "bg-indigo-100" : ""}`}><Icon className="h-5 w-5" /></span>
              {link.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
