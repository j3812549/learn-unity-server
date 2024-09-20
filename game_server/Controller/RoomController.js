const BaseController = require("./BaseController")
const { ReturnPack } = require('../pack')

class RoomController extends BaseController {
  constructor() {
    super()
    this.requestCode = this.TYPES.RequestCode.Room
  }

  CreateRoom(client, requestPack) {
    return client.getServer().createRoom(client, requestPack)
  }

  FindRoom(client, requestPack) {
    const returnPack = new ReturnPack()

    returnPack.code = this.TYPES.ReturnCode.Succeed
    returnPack.data = client.getServer().findRoom(client, requestPack)

    return returnPack
  }

  JoinRoom(client, requestPack) {
    let returnPack = new ReturnPack()
    const id = requestPack.data.roomId
    if (!id) { // 当没有房间的时候
      returnPack.code = this.TYPES.ReturnCode.Fail
      returnPack.msg = '房间不存在'
    } else {
      try {
        client.getServer().joinRoom(client, id)
        returnPack.code = this.TYPES.ReturnCode.Succeed
      } catch (err) {
        returnPack.msg = err
        returnPack.code = this.TYPES.ReturnCode.Fail
      }
    }

    return returnPack
  }
}

module.exports = RoomController
