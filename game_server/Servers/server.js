const net = require('net')
const User = require('./user')
const Client = require('./client')

class server {
  constructor(HOST, PORT) {
    this.HOST = HOST // ip
    this.PORT = PORT // 端口

    this.clientList = [] // 装客户端的数组
    this.initSocket()
  }

  /**
   * 创建TCP服务
   */
  initSocket() {
    const self = this

    const socket = net.createServer(function (skt) {
      skt.setEncoding("utf8")
    }).listen(self.PORT, self.HOST, function () {
      console.log(`启动Socket服务器 ${self.HOST}:${self.PORT}`)
    })
    socket.on('connection', function (skt) {
      socket.getConnections(function (error, count) {
        console.log('当前服务器的连接数 : ', count)
      })
      // 1、当客户端链接时会调用此方法并且生成一个独立的socket
      // 2、我们把独立的socket装进client类中进行处理
      // 3、同时我们把对应的用户信息类也装进去
      const user = new User()
      const client = new Client(self, user, skt)
      self.clientList.push(client) // 添加client进入数组

    })
    this.socket = socket
  }
}

module.exports = server