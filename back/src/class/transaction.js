class Transaction {
  static #list = []

  constructor(amount, type, paymentMethod, statusTran) {
    this.id = this.getRandomId(10000, 99999) // Assign a random ID
    this.amount = amount
    this.type = type
    this.paymentMethod = paymentMethod
    this.date = new Date().getTime()
    this.statusTran = statusTran
  }

  getRandomId(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static getList() {
    return this.#list
  }

  static getById(id) {
    return this.#list.find(
      (transaction) => transaction.id === id,
    )
  }

  static createTransaction(
    amount,
    type,
    paymentMethod,
    statusTran,
  ) {
    const newTransaction = new Transaction(
      amount,
      type,
      paymentMethod,
      statusTran,
    )
    this.#list.push(newTransaction)
    return newTransaction
  }

  static deleteTransaction(id) {
    this.#list = this.#list.filter(
      (transaction) => transaction.id !== id,
    )
  }
}

module.exports = { Transaction }
