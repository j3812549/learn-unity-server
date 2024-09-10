// 记录位置信息
class Pos {
  constructor() {
    this.x = 0
    this.y = 0
    this.z = 0
  }
}

class Client {
  constructor(server, user, socket) {
    this.server = server // server类
    this.socket = socket // socket链接
    this.user = user // 用户信息
    this.status = { // 存储血量、蓝量等状态的对象
      hp: 100,
      mp: 100
    }
    this.pos = new Pos() // 记录位置信息

    socket.on('data', function (data) {
      /**
       * 这里接收到客户端发来的信息，根据不同的信息处理对应的逻辑
       */
      console.log('服务器接收到 : ', data.toString())
    })

    socket.on('error', function (e) {
      console.log('报错，强制结束')
      socket.end()
    })

    socket.on('close', function (data) {
      console.log('结束了')
    })

  }
}

module.exports = Client