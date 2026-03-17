export default class Check {
  id: number
  type: 'income' | 'expense'
  amount: number
  description: string | null
  categoryId: number
  walletId: number
  createdAt: Date
  updatedAt: Date

  constructor(raw: any) {
    this.id = raw.id
    this.type = raw.type
    this.amount = Number(raw.amount)
    this.description = raw.description
    this.categoryId = raw.categoryId
    this.walletId = raw.walletId
    this.createdAt = new Date(raw.createdAt)
    this.updatedAt = new Date(raw.updatedAt)
  }

  static fromRaw(raw: any): Check {
    return new Check(raw)
  }
}
