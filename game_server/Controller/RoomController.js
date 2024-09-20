const BaseController = require("./BaseController")
const { ReturnPack } = require('../pack')

class RoomController extends BaseController {
  constructor() {
    super()
    this.requestCode = this.TYPES.RequestCode.Room
  }

  CreateRoom(client, requestPack) {
    client.getServer().createRoom(client)

    return requestPack
  }

  FindRoom(client, requestPack) {
    const returnPack = new ReturnPack()

    returnPack.code = this.TYPES.ReturnCode.Succeed
    returnPack.data = client.getServer().findRoom()

    return returnPack
  }

  JoinRoom(client, requestPack) {
    let returnPack = new ReturnPack()
    const id = requestPack.data.roomId
    if (!id) { // 当没有房间的时候
      returnPack.code = this.TYPES.ReturnCode.Fail
      returnPack.msg = this.TYPES.ReturnMsg.NoRoom
    } else {
      client.getServer().joinRoom(client, id)
      returnPack.code = this.TYPES.ReturnCode.Succeed
    }

    return returnPack
  }
}

module.exports = RoomController
