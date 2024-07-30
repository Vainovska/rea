const fs = require('fs')
const path = require('path')

class Notification {
  static #storageFile = path.join(
    __dirname,
    'notifications.json',
  )
  static #list = []
  static #count = 1
  constructor(userId, type, text) {
    this.id = Notification.#count++
    this.type = type
    this.text = text
    this.date = new Date().getTime()
    this.userId = userId
  }

  static async create(userId, type, text) {
    if (typeof userId !== 'number') {
      throw new Error('User ID must be a number')
    }
    if (!type || !text) {
      throw new Error('Type and text are required')
    }
    const newNotification = new Notification(
      userId,
      type,
      text,
    )
    Notification.#list.push(newNotification)
    console.log('Notification created:', newNotification)
    console.log('Notification list:', Notification.#list)
    await Notification.save(newNotification)
    await Notification.persist()
    return newNotification
  }
  static async load() {
    try {
      console.log('Loading notifications from file...')
      const data = await fs.promises.readFile(
        Notification.#storageFile,
        'utf8',
      )
      Notification.#list = JSON.parse(data)
      console.log(
        'Loaded notifications:',
        Notification.#list,
      )
    } catch (error) {
      console.error('Error loading notifications:', error)
      if (error.code === 'ENOENT') {
        Notification.#list = []
      } else {
        throw error
      }
    }
  }
  static async getList(userId) {
    console.log(
      'Notification.getList() called for user',
      userId,
    )
    await Notification.load()
    const userNotifications = Notification.#list.filter(
      (notification) => notification.userId === userId,
    )
    console.log('User notifications:', userNotifications)
    return userNotifications
  }

  static async save(notification) {
    await Notification.load()
    const index = Notification.#list.findIndex(
      (item) => item.id === notification.id,
    )
    if (index > -1) {
      Notification.#list[index] = notification
    } else {
      Notification.#list.push(notification)
    }
    console.log('Saving notifications:', Notification.#list)
    await Notification.persist()
  }

  static async persist() {
    await fs.promises.writeFile(
      Notification.#storageFile,
      JSON.stringify(Notification.#list),
    )
  }
}

module.exports = { Notification }
