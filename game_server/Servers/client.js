const ControllerManager = require('../Controller/ControllerManager')
const TYPES = require('../types')


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

    this.controllerManager = new ControllerManager(this)

    this.pingEndTime = new Date().getTime() // 每一次心跳的最后时间
    this.pingCloseMins = 10 // 多少分钟无响应关闭链接

    const self = this
    socket.on('data', function (data) {
      /**
       * 这里接收到客户端发来的信息，根据不同的信息处理对应的逻辑
       */

      self.pingEndTime = new Date().getTime() // 更新pingEndTime

      self.controllerManager.handleRequest(data, self)
    })

    socket.on('error', function (e) {
      console.log('报错，强制结束')
      socket.end()
    })

    socket.on('close', function (data) {
      self.server.deleteClientList(self)
      console.log('结束了')
    })

    // 连接5秒后还没有token则销毁当前socket
    setTimeout(() => {
      const token = this.user.getToken()
      if (token == null) {
        this.close()
      }
    }, 5000)
  }

  getServer() {
    return this.server
  }

  getUser() {
    return this.user
  }

  // 检测是否过期连接
  checkedPingExpired() {
    const now = new Date().getTime()
    const pingCloseTime = this.pingCloseMins * 60 * 1000
    if (now > pingCloseTime + this.pingEndTime) return false
    return true
  }

  // 断开连接
  close() {
    this.socket.end()
  }

  // 发送数据给客户端
  send(returnPack) {
    try {
      // 发送JSON数据
      this.socket.write(JSON.stringify(returnPack))
    } catch (err) {
      this.socket.write(JSON.stringify({
        code: TYPES.ReturnCode.Fail,
        data: null,
        msg: JSON.stringify(err)
      }))
    }
  }
}

module.exports = Client