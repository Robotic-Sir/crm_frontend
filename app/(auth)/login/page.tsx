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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            CRM Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-4"
          >
            <div>
              <Input
                type="email"
                placeholder="Email"
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

            <div>
              <Input
                type="password"
                placeholder="Password"
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
              className="w-full"
              disabled={
                mutation.isPending
              }
            >
              {mutation.isPending
                ? "Logging in..."
                : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}