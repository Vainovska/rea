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
    return newNotification
  }

  static getById(userId) {
    return (
      this.#list.find(
        (item) => item.userId === Number(userId),
      ) || []
    )
  }

  static getList() {
    return this.#list
  }
}
module.exports = { Notification }
