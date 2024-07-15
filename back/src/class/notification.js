class Notification {
  static #list = []
  static #count = 1

  constructor(userId, type, text) {
    this.id = Notification.#count++
    this.type = type
    this.text = text
    this.date = new Date().getTime()
    this.userId = userId
  }

  static create(userId, type, text) {
    const newNotification = new Notification(
      userId,
      type,
      text,
    )
    this.#list.push(newNotification)
    console.log(this.#list)
    return newNotification
  }

  static getById(id) {
    return (
      this.#list.find((item) => item.id === Number(id)) ||
      null
    )
  }

  static getList() {
    return this.#list
  }

  static getListByUserId(userId) {
    return this.#list.filter(
      (item) => item.userId === userId,
    )
  }
}

module.exports = { Notification }
