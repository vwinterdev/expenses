import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { computed } from 'vue'
import { API } from '@/libs/ky'
import Wallet from '../models/Wallet'
export interface CreateWalletRequest {
  name: string
  description: string
  icon: string
  color: string
}

export const useCreateWallet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateWalletRequest) => {
      const response = await API.post('wallets/create', {
        json: data,
      })
      const responseJson = await response.json()
      const newItem = Wallet.fromRaw(responseJson)
      queryClient.setQueryData(['wallets'], (old: any) => [...old, newItem])
    },
  })
}

export const useWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await API.get('wallets')
      const data = await response.json()
      const items = Array.isArray(data) ? data : []
      return items.map((item: any) => Wallet.fromRaw(item))
    },
  })
}

export const useWallet = (id: Ref<string>) => {
  return useQuery({
    queryKey: computed(() => ['wallets', id]),
    queryFn: async () => {
      const response = await API.get(`wallets/${id.value}`)
      const data = await response.json()
      return Wallet.fromRaw(data)
    },
    enabled: computed(() => !!id.value),
  })
}
