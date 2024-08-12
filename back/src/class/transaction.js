class Transaction {
  static #list = []

  constructor({
    id,
    user,
    amount,
    type,
    paymentMethod,
    status,
    userEmail,
  }) {
    this.id = id || this.getRandomId(10000, 99999) // Assign a random ID if not provided
    this.user = user
    this.amount = amount
    this.type = type
    this.paymentMethod = paymentMethod
    this.date = new Date().getTime()
    this.status = status
    this.userEmail = userEmail
  }

  getRandomId(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static getList() {
    return this.#list
  }

  static getListByUserId(userId) {
    return this.#list.filter(
      (transaction) => transaction.user === userId,
    )
  }

  static getById(id) {
    console.log('Transaction.getById called with ID:', id)
    const transaction = this.#list.find(
      (transaction) => transaction.id === id,
    )
    if (!transaction) {
      console.log(
        'Transaction not found in list for ID:',
        id,
      )
    }
    return transaction
  }
  static createTransaction({
    user,
    amount,
    type,
    paymentMethod,
    status,
    userEmail,
  }) {
    const newTransaction = new Transaction({
      user,
      amount,
      type,
      paymentMethod,
      status,
      userEmail,
    })
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
