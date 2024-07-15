class User {
  static #list = []
  static #count = 1
  constructor({ email, password }) {
    this.id = User.#count++
    this.email = String(email).toLowerCase()
    this.password = String(password)
    this.isConfirm = false
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
  static getList = () => User.#list
}

module.exports = { User }
