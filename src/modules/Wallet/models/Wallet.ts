import CategoryWithBalance from '@/modules/categories/models/CategoryWithBalance'

export default class Wallet {
  id: number
  name: string
  description: string
  icon: string
  color: string
  createdAt: Date
  updatedAt: Date
  balance: number
  categories: CategoryWithBalance[]

  constructor(raw: any) {
    this.id = Number(raw.id)
    this.name = raw.name
    this.description = raw.description
    this.icon = raw.icon
    this.color = raw.color
    this.createdAt = new Date(raw.createdAt)
    this.updatedAt = new Date(raw.updatedAt)
    this.balance = Number(raw.balance) || 0
    this.categories = (raw.categories || []).map(CategoryWithBalance.fromRaw)
  }

  static fromRaw(raw: any): Wallet {
    return new Wallet(raw)
  }
}
