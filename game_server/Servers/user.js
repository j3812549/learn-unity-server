class User {
  constructor() {
    this.id = Number(Math.random().toFixed(5) * 100000)
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  getToken() {
    return this.token
  }
}

module.exports = User
