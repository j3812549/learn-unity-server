module.exports = {
  /**
   * 处理客户端发送来的请求code标识
   */
  RequestCode: {
    RequestNone: 0,
    User: 1, // 用户
    Room: 2, // 房间
    Game: 3, //游戏
  },
  /**
   * 处理返回客户端的标识
   */
  ReturnCode: {
    ReturnNone: 0,
    Succeed: 1, // 成功
    Fail: 2, // 失败
    NotRoom: 3 // 没有房间
  },
  // 处理错误响应的文本信息
  ReturnMsg: {
    JsonParseFail: `解析JSON失败`,
    NoCode: `没有匹配的code`,
    NoMethod: `没有匹配的method`,
    ExitUser: `退出成功`
  },
  ActionCode: {
    ActionNone: 0,
    Logon: 1, // 注册
    Login: 2, // 登录
    ExitUser: 16, // 退出登录


    CreateRoom: 3, // 创建房间
    FindRoom: 4, // 查询房间
    PlayerList: 5, // 玩家列表
    JoinRoom: 6, // 加入房间
    Exit: 7, // 离开
    Chat: 8, // 聊天
    StartGame: 9, // 开始游戏
    Starting: 10, // 服务端发送来的开始游戏指令


    UpPos: 11, // 更新位置
    ExitGame: 12, // 离开游戏
    UpCharacterList: 13, // 更新角色和玩家列表
    Fire: 14, // 开火
    Hit: 15, // 击中
  }
}