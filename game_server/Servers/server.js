const net = require('net')
const User = require('./user')
const Client = require('./client')
const Room = require('./room')
const _ = require('lodash')

class server {
  constructor(HOST, PORT) {
    this.HOST = HOST // ip
    this.PORT = PORT // 端口

    this.socket = null
    this.clientList = [] // 装客户端的数组
    this.roomList = [] // 装房间的数组
    this.lastRoomId = 0 // 标识id、房间号

    this.initSocket()
    this.loopPing()
  }

  // 循环=心跳监听
  loopPing() {
    setInterval(() => {
      // 使用filter函数过滤的同时进行赋值，当检测到连接过期时候则断开连接，同时去掉clientList中的失效client
      this.clientList = this.clientList.filter(c => {
        if (c.checkedPingExpired()) {
          return true
        } else {
          c.close() // 断开连接
          return false
        }
      })
    }, 1000)
  }

  addClientList(client) {
    this.clientList.push(client)
  }

  deleteClientList(client) {
    this.clientList = this.clientList.filter(c => c !== client)
  }

  /**
   * 创建房间
   */
  createRoom(client, requestPack) {
    // 自增lastRoomId，保证不重复
    this.lastRoomId = this.lastRoomId + 1
    const room = new Room(this.lastRoomId, this, client)
    this.roomList.push(room) // 将新建的room装进数组中

    return requestPack
  }

  /**
   * 查找房间
   */
  findRoom(client, requestPack) {
    // 将roomList的数据，并且调用getRoomInfo方法获取房间信息返回
    const resultList = _.cloneDeep(this.roomList).map(room => room.getRoomInfo())
    return resultList
  }

  /**
   * 加入房间
   */
  joinRoom(client, id) {
    try {
      const room = this.roomList.find(room => room.getRoomInfo().id === id)
      room.join(client)
    } catch (err) {
      throw err
    }
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
      new Client(self, user, skt)
    })
    this.socket = socket
  }
}

module.exports = server