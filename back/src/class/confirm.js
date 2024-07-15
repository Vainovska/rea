class Confirm {
  static #list = []

  constructor(data) {
    this.code = Confirm.generateCode()
    this.data = data
  }

  static generateCode() {
    return Math.floor(Math.random() * 9000) + 1000
  }

  static create(data) {
    const confirmation = new Confirm(data)
    this.#list.push(confirmation)
    setTimeout(() => {
      this.delete(confirmation.code)
    }, 24 * 60 * 60 * 1000) // 24 hours
    console.log(this.#list)
  }

  static delete(code) {
    const initialLength = this.#list.length
    this.#list = this.#list.filter(
      (item) => item.code !== code,
    )
    return initialLength > this.#list.length
  }

  static getData(code) {
    const obj = this.#list.find(
      (item) => item.code === code,
    )
    return obj ? obj.data : null
  }
}

module.exports = { Confirm }
