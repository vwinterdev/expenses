import { useMutation, useQuery } from '@tanstack/vue-query'
import { API } from '@/libs/ky'

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
  }
}

// Получение текущего пользователя
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await API.get('auth/me')
      return response.json()
    },
    // Запрос всегда выполняется, если есть куки - вернёт пользователя, если нет - вернёт 401
    retry: false, // Не делаем retry для auth/me чтобы не зациклиться
  })
}

// Регистрация
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await API.post('auth/signup', { json: data })
      return response.json<AuthResponse>()
    },
    // Токены автоматически устанавливаются в куки сервером
  })
}

// Логин
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await API.post('auth/signin', { json: data })
      return response.json<AuthResponse>()
    },
    // Токены автоматически устанавливаются в куки сервером
  })
}

// Логаут
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      // Вызываем logout на сервере
      // Сервер сам очистит куки через Set-Cookie с истекшим expires
      await API.post('auth/logout')
    },
  })
}
