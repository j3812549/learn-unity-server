class User {
  constructor() {
    this.id = Number(Math.random().toFixed(5) * 100000)
    this.token = null
  }
}

module.exports = User
