const BaseController = require("./BaseController")

class RoomController extends BaseController {
  constructor() {
    super()
    this.requestCode = this.TYPES.RequestCode.Room
  }

  CreateRoom(client, requestPack) {
    return client.getServer().CreateRoom(client, requestPack)
  }
}

module.exports = RoomController
