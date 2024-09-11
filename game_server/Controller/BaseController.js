const TYPES = require('../types')

class BaseController {
  constructor() {
    this.requestCode = TYPES.RequestCode.RequestNone
    this.TYPES = TYPES
  }

  GetRequestCode() {
    return this.requestCode
  }
}

module.exports = BaseController
