import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
})

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

/*
|--------------------------------------------------------------------------
| REFRESH TOKEN QUEUE SYSTEM
|--------------------------------------------------------------------------
*/

let isRefreshing = false

let failedQueue: {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}[] = []

const processQueue = (
  error: unknown,
  token: string | null = null
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })

  failedQueue = []
}

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      /*
      |--------------------------------------------------------------------------
      | WAIT IF REFRESH ALREADY RUNNING
      |--------------------------------------------------------------------------
      */

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true

      try {
        const refresh = localStorage.getItem("refresh_token")

        if (!refresh) {
          localStorage.clear()
          window.location.href = "/login"
          return Promise.reject(error)
        }

        const response = await axios.post(
          `${BASE_URL}/api/token/refresh/`,
          {
            refresh,
          }
        )

        const newAccessToken = response.data.access

        localStorage.setItem(
          "access_token",
          newAccessToken
        )

        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)

      } catch (refreshError) {
        processQueue(refreshError, null)

        localStorage.clear()

        window.location.href = "/login"

        return Promise.reject(refreshError)

      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api