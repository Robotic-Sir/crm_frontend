import { create } from "zustand"

import { persist } from "zustand/middleware"

import { User } from "@/lib/types/auth"

interface AuthStore {
  user: User | null

  accessToken: string | null

  refreshToken: string | null

  setAuth: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => void

  logout: () => void

  isAuthenticated: () => boolean

  isSuperAdmin: () => boolean
}

export const useAuthStore =
  create<AuthStore>()(
    persist(
      (set, get) => ({
        user: null,

        accessToken: null,

        refreshToken: null,

        setAuth: (
          user,
          accessToken,
          refreshToken
        ) => {
          localStorage.setItem(
            "access_token",
            accessToken
          )

          localStorage.setItem(
            "refresh_token",
            refreshToken
          )

          set({
            user,
            accessToken,
            refreshToken,
          })
        },

        logout: () => {
          localStorage.clear()

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
          })
        },

        isAuthenticated: () => {
          return !!get().user
        },

        isSuperAdmin: () => {
          return (
            get().user?.role ===
            "superadmin"
          )
        },
      }),

      {
        name: "auth-store",
      }
    )
  )