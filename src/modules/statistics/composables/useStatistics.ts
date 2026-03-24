import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { computed } from 'vue'
import { API } from '@/libs/ky'

export interface StatisticRow {
  categoryId: number
  categoryName: string
  categoryColor: string
  categoryIcon: string
  categoryType: 'income' | 'expense' | 'mixed'
  total: string
}

export interface StatisticsSummary {
  totalIncome: string
  totalExpense: string
}

export interface StatisticsData {
  summary: StatisticsSummary
  listCategories: StatisticRow[]
}

export const useWalletStatistics = (walletId: Ref<number>, date: Ref<Date>) => {
  return useQuery({
    queryKey: computed(() => ['statistics', walletId.value, date.value.toISOString().slice(0, 7)]),
    queryFn: async () => {
      const dateStr = date.value.toISOString().slice(0, 10)
      const response = await API.get(`statistics/wallet-by-period/${walletId.value}?date=${dateStr}`)
      const json = await response.json<{ data: StatisticsData }>()
      return json.data
    },
    enabled: computed(() => !!walletId.value),
  })
}
