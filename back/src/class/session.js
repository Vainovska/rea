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
    console.log('Session created:', session)
    return session
  }

  static get(token) {
    console.log('Session.get called with token:', token)
    const session = Session.#list.find(
      (session) => session.token === token,
    )
    console.log('Found session:', session)
    return session || null
  }

  static save(token, sessionData) {
    console.log(
      'Session.save called with token:',
      token,
      'and sessionData:',
      sessionData,
    )
    const index = Session.#list.findIndex(
      (session) => session.token === token,
    )
    if (index !== -1) {
      Session.#list[index] = sessionData
    } else {
      Session.#list.push(sessionData)
    }
  }
}

module.exports = { Session }
