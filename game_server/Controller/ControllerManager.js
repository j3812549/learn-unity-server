const BaseController = require('./BaseController')
const GameController = require('./GameController')
const UserController = require('./UserController')
const RoomController = require('./RoomController')
const { RequestPack, ReturnPack } = require('../pack')

class ControllerManager extends BaseController {
  constructor() {
    super()
    this.controlDict = new Map()  // 存入标识对应的类

    // 把对应的类丢到集合中，要用的时候根据标识取出
    const gameController = new GameController()
    const userController = new UserController()
    const roomController = new RoomController()
    this.controlDict.set(userController.requestCode, userController)
    this.controlDict.set(gameController.requestCode, gameController)
    this.controlDict.set(roomController.requestCode, roomController)

  }

  // 处理请求
  handleRequest(data, client) {
    // 声明请求和响应的pack
    let returnPack = new ReturnPack()
    let requestPack = new RequestPack()

    returnPack.code = this.TYPES.ReturnCode.Fail // 初始设置为失败

    try {
      data = JSON.parse(data) // 解析JSON对象，获取对象
    } catch (err) {
      returnPack.msg = this.TYPES.ReturnMsg.JsonParseFail
      client.send(returnPack)
      return
    }

    requestPack = Object.assign(requestPack, data) // 将客户端的数据赋值给requestPack中

    // 1.根据字典查询客户端请求标识判断调用哪个类,没有则返回错误
    if (this.controlDict.get(requestPack.requestCode)) {
      // 2.根据types.js中的ActionCode匹配类中的方法，并且调用，没有则返回错误
      const methodName = Object.keys(this.TYPES.ActionCode).find(key => this.TYPES.ActionCode[key] === requestPack.actionCode)
      const method = this.controlDict.get(requestPack.requestCode)[methodName]
      if (method) {
        // 3.当获取到此类中有对应的方法时候，则传入client,和requestPack。
        const pack = method(client, requestPack.data)
        if (pack) {
          // 4.如果类中方法返回了ReturnPack，则向客户端发送
          client.send(pack)
        }
        return
      } else {
        returnPack.msg = this.TYPES.ReturnMsg.NoMethod
      }
    } else {
      returnPack.msg = this.TYPES.ReturnMsg.NoCode
    }

    client.send(returnPack)

  }
}

module.exports = ControllerManager
