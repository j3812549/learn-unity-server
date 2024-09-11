const BaseController = require("./BaseController")

class UserController extends BaseController {
  constructor() {
    super()
    this.requestCode = this.TYPES.RequestCode.User
  }

  Logon() {
    console.log('调用Logon成功')
  }
}

module.exports = UserController
