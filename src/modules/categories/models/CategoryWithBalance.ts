import Category from './Category'

export default class CategoryWithBalance extends Category {
  balance: number

  constructor(raw: any) {
    super(raw)
    this.balance = Number(raw.balance) || 0
  }

  static fromRaw(raw: any): CategoryWithBalance {
    return new CategoryWithBalance(raw)
  }
}
