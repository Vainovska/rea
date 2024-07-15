class Balance {
  static #list = []

  constructor(userId, amount = 0) {
    this.userId = userId
    this.amount = amount
  }

  static create(userId, amount = 0) {
    const balance = new Balance(userId, amount)
    this.#list.push(balance)
    return balance
  }

  static getByUserId(userId) {
    return (
      this.#list.find(
        (balance) => balance.userId === Number(userId),
      ) || null
    )
  }

  static updateBalance(userId, amount) {
    const balance = this.getByUserId(userId)
    if (balance) {
      balance.amount += amount
      return balance
    }
    return null
  }

  static setBalance(userId, amount) {
    const balance = this.getByUserId(userId)
    if (balance) {
      balance.amount = amount
      return balance
    }
    return null
  }

  static getBalances() {
    return this.#list
  }
}

module.exports = { Balance }
