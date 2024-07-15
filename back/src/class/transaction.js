class Transaction {
  static #list = []
  constructor(amount, type, paymentMethod, statusTran) {
    this.id = function getRandomId(min, max) {
      return (
        Math.floor(Math.random() * (99999 - 10000)) + 10000
      )
    }
    this.amount = amount
    this.type = type
    this.paymentMethod = paymentMethod
    this.date = new Date().getTime()
    this.statusTran = statusTran
  }
  static getList = () => this.#list
  static getById = (id) => {
    return (this.#list = this.#list.filter(
      (transaction) => transaction.id === id,
    ))
  }
  static createTransaction = () => {
    const newTransaction = new Transaction(
      id,
      amount,
      type,
      date,
      paymentMethod,
      statusTran,
    )
    this.#list.push(newTransaction)
    return newTransaction
  }

  static deleteTransaction = () => {
    return (this.#list = this.#list.filter(
      (transaction) => transaction.id !== id,
    ))
  }
}

module.exports = { Transaction }
