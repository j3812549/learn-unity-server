class Room {
  constructor(id, server, client) {
    this.server = server
    this.roomInfo = {
      id: id, // 标识id、房间号
      count: 1, // 总数
      maxCount: 4, // 最大人数
      playerKing: client // 房主

    }
    this.clientList = [client] // 房间中的人
  }
}

module.exports = Room
