const BaseController = require("./BaseController")
const { ReturnPack } = require('../pack')

class UserController extends BaseController {
  constructor() {
    super()
    this.requestCode = this.TYPES.RequestCode.User
  }

  Logon() {
    console.log('调用Logon成功')
  }

  // 登录
  Login(client, requestPack) {
    let returnPack = new ReturnPack()
    // 把RequestPack中的requestCode和actionCode赋值给returnPack
    returnPack = Object.assign(returnPack, requestPack)
    if (requestPack.data.name) {
      const token = Math.random().toFixed(3) * 1000 // 随机数
      returnPack.code = this.TYPES.ReturnCode.Succeed
      returnPack.data = token
      client.getUser().setToken(token) // 添加用户信息token
      client.getServer().addClientList(client) // 登录成功添加进clientList中管理
    } else {
      returnPack.code = this.TYPES.ReturnCode.Fail

      client.close()
      return // 销毁了则不需要返回
    }

    return returnPack // 返回成功的信息
  }

  // 退出
  ExitUser(client, requestPack) {
    let returnPack = new ReturnPack()
    // 把RequestPack中的requestCode和actionCode赋值给returnPack
    returnPack = Object.assign(returnPack, requestPack, { data: null })
    returnPack.code = this.TYPES.ReturnCode.Succeed
    returnPack.msg = this.TYPES.ReturnMsg.ExitUser

    client.getServer().deleteClientList(client) // 删除ClientList中的client
    setTimeout(() => {
      client.close() // 延迟3秒断开，让客户端接收到退出成功的信息
    }, 3000)
    return returnPack
  }
}

module.exports = UserController
