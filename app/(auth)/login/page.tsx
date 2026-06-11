"use client"

import { useRouter } from "next/navigation"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"

import { useMutation } from "@tanstack/react-query"

import toast from "react-hot-toast"

import {
  login,
  getMe,
} from "@/lib/api/auth"

import { useAuthStore } from "@/lib/store/auth"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(
      6,
      "Minimum 6 characters"
    ),
})

type LoginSchema = z.infer<
  typeof loginSchema
>

export default function LoginPage() {
  const router = useRouter()

  const setAuth = useAuthStore(
    (state) => state.setAuth
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(
      loginSchema
    ),
  })

  const mutation = useMutation({
    mutationFn: async (
      values: LoginSchema
    ) => {
      /*
      |--------------------------------------------------------------------------
      | LOGIN
      |--------------------------------------------------------------------------
      */

      const tokens = await login(
        values
      )

      /*
      |--------------------------------------------------------------------------
      | STORE TOKENS
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "access_token",
        tokens.access
      )

      localStorage.setItem(
        "refresh_token",
        tokens.refresh
      )

      /*
      |--------------------------------------------------------------------------
      | FETCH CURRENT USER
      |--------------------------------------------------------------------------
      */

      const user = await getMe()

      return {
        user,
        tokens,
      }
    },

    onSuccess: ({
      user,
      tokens,
    }) => {
      /*
      |--------------------------------------------------------------------------
      | STORE AUTH STATE
      |--------------------------------------------------------------------------
      */

      setAuth(
        user,
        tokens.access,
        tokens.refresh
      )

      toast.success(
        "Login successful"
      )

      /*
      |--------------------------------------------------------------------------
      | REDIRECT TO DASHBOARD
      |--------------------------------------------------------------------------
      */

      router.replace(
        "/dashboard"
      )
    },

    onError: (error) => {
      console.error(error)

      toast.error(
        "Invalid credentials"
      )
    },
  })

  const onSubmit = (
    values: LoginSchema
  ) => {
    mutation.mutate(values)
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 p-12">
        <div className="max-w-sm text-center">
          <div className="mb-8 text-7xl">🤖</div>
          <h2 className="mb-3 text-4xl font-bold text-white">
            RoboticSir CRM
          </h2>
          <p className="mb-10 text-indigo-200 text-lg">
            The all-in-one platform for your sales team
          </p>
          <ul className="space-y-4 text-left">
            <li className="flex items-center gap-3 text-indigo-100">
              <span className="text-indigo-300">✦</span>
              Manage leads and contacts
            </li>
            <li className="flex items-center gap-3 text-indigo-100">
              <span className="text-indigo-300">✦</span>
              WhatsApp automation
            </li>
            <li className="flex items-center gap-3 text-indigo-100">
              <span className="text-indigo-300">✦</span>
              Campaign tracking
            </li>
            <li className="flex items-center gap-3 text-indigo-100">
              <span className="text-indigo-300">✦</span>
              Team collaboration
            </li>
          </ul>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden text-center">
            <span className="text-5xl">🤖</span>
          </div>

          <Card className="w-full border-0 shadow-none md:border md:shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Welcome back
              </CardTitle>
              <p className="text-sm text-slate-500">
                Sign in to your account
              </p>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(
                  onSubmit
                )}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {
                        errors.email
                          .message
                      }
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...register(
                      "password"
                    )}
                  />

                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {
                        errors.password
                          .message
                      }
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                  disabled={
                    mutation.isPending
                  }
                >
                  {mutation.isPending
                    ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Signing in...
                      </span>
                    )
                    : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
