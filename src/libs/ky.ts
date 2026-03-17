import ky, { HTTPError, type KyInstance } from 'ky'
import { router } from '@/plugins/router'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export interface ApiError {
  message: string
  code?: string
  statusCode: number
  details?: unknown
}

// Флаг для предотвращения множественных одновременных refresh запросов
let isRefreshing = false
let refreshPromise: Promise<void> | null = null

// Функция обновления токена
async function refreshAccessToken(): Promise<void> {
  // Если уже идёт обновление - ждём его
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      // Запрос на обновление токена
      // Refresh токен автоматически отправится через куки
      // Новые токены автоматически установятся в куки сервером
      await ky.post('auth/refresh', {
        prefixUrl: API_BASE_URL,
        credentials: 'include',
        retry: 0,
      })
    } catch (error) {
      // Если refresh вернул 401 - сессия истекла, редиректим на логин
      if (error instanceof HTTPError && error.response.status === 401) {
        console.warn('Refresh token expired or invalid, redirecting to login...')
        // Используем replace чтобы не добавлять в историю
        router.replace('/login')
      }
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// Создание базового клиента
const createApiClient = (): KyInstance => {
  return ky.create({
    prefixUrl: API_BASE_URL,
    timeout: 30000,
    credentials: 'include', // Важно! Автоматически отправляем куки с каждым запросом
    retry: {
      limit: 2,
      methods: ['get', 'post', 'put', 'patch', 'delete'],
      statusCodes: [401, 408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      beforeRequest: [
        (request) => {
          // Токены автоматически передаются через куки
          // Добавляем только дополнительные заголовки при необходимости
          request.headers.set('X-Client-Version', '1.0.0')
        },
      ],
      beforeRetry: [
        async ({ error, retryCount }) => {
          console.warn(`Retry attempt ${retryCount}:`, error)

          // Если 401 - пытаемся обновить токен
          if (error instanceof HTTPError && error.response.status === 401) {
            try {
              console.log('Token expired, refreshing...')
              await refreshAccessToken()
              // После успешного refresh, запрос автоматически повторится с новым токеном из куки
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError)
              throw refreshError
            }
          }
        },
      ],
      beforeError: [
        async (error) => {
          const { response } = error

          if (response) {
            let errorData: ApiError

            try {
              // Пытаемся распарсить JSON с ошибкой
              errorData = await response.json()
            } catch {
              // Если не JSON, берём текст
              const text = await response.text()
              errorData = {
                message: text || response.statusText,
                statusCode: response.status,
              }
            }

            // Обогащаем объект ошибки данными с сервера
            error.message = errorData.message || error.message
            ;(error as HTTPError & { apiError: ApiError }).apiError = errorData
          }

          return error
        },
      ],
      afterResponse: [
        async (_request, _options, response) => {
          // Логирование успешных запросов в dev режиме
          if (import.meta.env.DEV) {
            console.log(`[API] ${response.status} ${response.url}`)
          }
          return response
        },
      ],
    },
  })
}

// Экспорт единственного экземпляра клиента
export const API = createApiClient()

// Утилиты для работы с ошибками
export function isApiError(error: unknown): error is HTTPError & { apiError: ApiError } {
  return error instanceof HTTPError && 'apiError' in error
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.apiError.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Произошла неизвестная ошибка'
}
