import type { App } from 'vue'
import { setupIonic } from './ionic'
import { setupQuery } from './query'
import { router } from './router'

export { router }

export function setupPlugins(app: App) {
  setupIonic(app)
  app.use(router)
  setupQuery(app)
}
