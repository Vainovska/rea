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
    console.log('Confirmation created:', confirmation)
    console.log('Current confirmation list:', this.#list)
    setTimeout(() => {
      this.delete(confirmation.code)
    }, 24 * 60 * 60 * 1000) // 24 hours
    return confirmation // Return the code for debugging
  }

  static delete(code) {
    const initialLength = this.#list.length
    this.#list = this.#list.filter(
      (item) => item.code !== code,
    )
    console.log(
      'Confirmation deleted. Current list:',
      this.#list,
    )
    return initialLength > this.#list.length
  }

  static getData(code) {
    console.log('Getting data for code:', code)
    console.log('Type of code:', typeof code)
    console.log('Current list:', this.#list)
    const obj = this.#list.find(
      (item) => item.code === Number(code),
    )
    console.log('Found object:', obj)
    return obj ? obj.data : null
  }
}

module.exports = { Confirm }
