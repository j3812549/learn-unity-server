const TYPES = require('./types')

/**
 * 
 * @param {*} requestCode 为TYPES.RequestCode中的值，标识用户状态
 * @param {*} actionCode 为TYPES.ActionCode中的值，处理业务逻辑
 * @param {*} code 为TYPES.ReturnCode中的值，标识响应状态
 * @param {*} data 接收与返回的数据层
 * @param {*} msg 抛出的信息框
*/

// 接受请求的pack

function RequestPack() {
  RequestPack.prototype.requestCode = TYPES.RequestCode.RequestNone
  RequestPack.prototype.actionCode = TYPES.ActionCode.ActionNone
  RequestPack.prototype.data = null
}

// 返回请求的pack
function ReturnPack() {
  ReturnPack.prototype.code = TYPES.ReturnCode.ReturnNone
  ReturnPack.prototype.requestCode = TYPES.RequestCode.RequestNone
  RequestPack.prototype.actionCode = TYPES.ActionCode.ActionNone
  ReturnPack.prototype.data = null
  ReturnPack.prototype.msg = ''
}

module.exports = {
  RequestPack,
  ReturnPack
}
