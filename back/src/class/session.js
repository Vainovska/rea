class Session {
  static #list = []

  constructor(user) {
    this.token = Session.generateCode()
    this.user = {
      email: user.email,
      isConfirm: user.isConfirm,
      id: user.id,
    }
  }

  static generateCode() {
    const length = 6
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length,
      )
      result += characters[randomIndex]
    }
    return result
  }

  static create(user) {
    const session = new Session(user)
    Session.#list.push(session)
    return session
  }

  static get(token) {
    return (
      Session.#list.find(
        (session) => session.token === token,
      ) || null
    )
  }
}

module.exports = { Session }

console.log(Session.generateCode())
