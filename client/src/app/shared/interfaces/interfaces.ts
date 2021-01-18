export interface User{
    login:String,
    password:String,
    _id?: String,
    isOnline?: Boolean,
    isAdmin?: Boolean,
    isBanned?: Boolean,
    isMute?: Boolean,
    chatColor?: String,
}

  export interface dataMessage{
    userName?: String,
    text: String,
    chatColor?: String
  }
  