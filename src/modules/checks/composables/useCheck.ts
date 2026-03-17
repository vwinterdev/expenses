import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { computed } from 'vue'
import { API } from '@/libs/ky'
import Check from '../models/Check'

export interface CreateCheckRequest {
  type: 'income' | 'expense'
  amount: number
  description?: string
  categoryId: number
  walletId: number
}

export const useCreateCheck = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCheckRequest) => {
      const response = await API.post('checks/create', {
        json: data,
      })
      const responseJson = await response.json()
      const newItem = Check.fromRaw(responseJson)
      queryClient.setQueryData(['checks'], (old: any) => [...(old || []), newItem])
      return newItem
    },
  })
}

export const useChecks = (walletId?: Ref<number>) => {
  return useQuery({
    queryKey: computed(() => (walletId ? ['checks', walletId.value] : ['checks'])),
    queryFn: async () => {
      const url = walletId?.value ? `checks?walletId=${walletId.value}` : 'checks'
      const response = await API.get(url)
      const data = await response.json()
      const items = Array.isArray(data) ? data : []
      return items.map((item: any) => Check.fromRaw(item))
    },
    enabled: computed(() => !walletId || !!walletId.value),
  })
}
