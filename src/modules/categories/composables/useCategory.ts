import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { computed } from 'vue'
import { API } from '@/libs/ky'
import Category from '../models/Category'

export enum CategoryType {
  Income = 'income',
  Expense = 'expense',
}

export interface CreateCategoryRequest {
  name: string
  type: CategoryType
  color: string
  icon: string
  walletId: number
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const response = await API.post('categories/create', {
        json: data,
      })
      const responseJson = await response.json()
      const newItem = Category.fromRaw(responseJson)

      // Обновляем кэш для конкретного кошелька
      queryClient.setQueryData(['categories', data.walletId], (old: any) => [...(old || []), newItem])

      return newItem
    },
  })
}

export const useCategories = (idWallet: Ref<number>) => {
  return useQuery({
    queryKey: computed(() => ['categories', idWallet.value]),
    queryFn: async () => {
      const response = await API.get(`categories/wallet/${idWallet.value}`)
      const responseJson = await response.json()
      return responseJson.map((item: any) => Category.fromRaw(item))
    },
    enabled: computed(() => !!idWallet.value),
  })
}
