class User {
  static #list = []
  static #count = 1

  constructor({ email, password, balance }) {
    this.id = User.#count++
    this.email = String(email).toLowerCase()
    this.password = String(password)
    this.isConfirm = false
    this.balance = balance || 0
  }

  static create(data) {
    const user = new User(data)
    console.log(user)
    User.#list.push(user)
    console.log(User.#list)
    return user
  }

  static getByEmail(email) {
    return (
      User.#list.find(
        (user) =>
          user.email === String(email).toLowerCase(),
      ) || null
    )
  }

  static getById(id) {
    return (
      User.#list.find((user) => user.id === Number(id)) ||
      null
    )
  }

  static getList() {
    return User.#list
  }

  static getByBalance(balance) {
    return (
      User.#list.find(
        (user) => user.balance === Number(balance),
      ) || null
    )
  }
  verifyPassword(password) {
    return this.password === password
  }

  save() {
    const index = User.#list.findIndex(
      (user) => user.id === this.id,
    )
    if (index > -1) {
      User.#list[index] = this
    }
    return this
  }
}

module.exports = { User }
