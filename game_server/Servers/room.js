const TYPES = require('../types')

class Room {
  constructor(id, server, client) {
    this.server = server
    this.clientList = [client] // 房间中的人
    this.id = id // 标识id、房间号
    this.count = 1 // 总数
    this.maxCount = 4 // 最大人数
    this.king = client // 房主
  }

  // 获取房间信息
  getRoomInfo() {
    return {
      id: this.id,
      count: this.count,
      maxCount: this.maxCount
    }
  }

  // 加入房间
  join(client) {
    if (this.maxCount <= this.count) throw TYPES.ReturnMsg.NoRoomByMax
    let c = null
    this.clientList.forEach(item => {
      if (item === client) c = item
    })

    if (c) throw TYPES.ReturnMsg.Romming

    this.clientList.push(client)
    this.count++

  }
}

module.exports = Room
