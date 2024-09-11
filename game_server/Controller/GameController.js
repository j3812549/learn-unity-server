const BaseController = require("./BaseController")

class GameController extends BaseController {
  constructor() {
    super()
    this.requestCode = this.TYPES.RequestCode.Game
  }
}

module.exports = GameController