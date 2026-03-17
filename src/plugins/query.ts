import { VueQueryPlugin } from '@tanstack/vue-query'
import type { App } from 'vue'

export function setupQuery(app: App) {
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 минут
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    },
  })
}
