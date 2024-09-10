const Server = require('./Servers/server')

class start {
  constructor() {
    new Server('127.0.0.1', 9527)
  }
}

module.exports = start