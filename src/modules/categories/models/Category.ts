export default class Category {
  id: number
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  walletId: number
  createdAt: Date
  updatedAt: Date

  constructor(raw: any) {
    this.id = raw.id
    this.name = raw.name
    this.type = raw.type
    this.color = raw.color
    this.icon = raw.icon
    this.walletId = raw.walletId
    this.createdAt = new Date(raw.createdAt)
    this.updatedAt = new Date(raw.updatedAt)
  }

  static fromRaw(raw: any): Category {
    return new Category(raw)
  }
}
