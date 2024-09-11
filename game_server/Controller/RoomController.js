const BaseController = require("./BaseController")

class RoomController extends BaseController {
  constructor() {
    super()
    this.requestCode = this.TYPES.RequestCode.Room
  }
}

module.exports = RoomController
