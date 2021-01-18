const User = require('../models/User')
const keys = require('../config/keys')
const jwt = require('jsonwebtoken')

const addConnection = (data) => {
 
    return User.findOneAndUpdate(
        { _id: data._id },
        {
            $set: {
                isOnline: true,
                chatColor: data.chatColor,
            }
        },
        { new: true })
}

const getUserByToken = async (token) => {
    const decoded = jwt.verify(token, keys.jwt);
    const user = await getUser(decoded._id);
    user.chatColor = decoded.chatColor
    return (decoded ? user : null);

}

const getUser = (id) => {
    return User.findOne({ _id: id })
}

const userDisconnect = (id) => {
    //Находим юзера и ставим оффлайн
    return User.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                isOnline: false,
                socketId: '',
                chatColor: ''
            }
        },
        { new: true }
    )

}

const getOnlineUsers = () => {
    return User.find({ isOnline: true })
}

const getOfflineUsers = () => {
    return User.find({ isOnline: false })
}

const muteUser = (id) => {
    return User.findOneAndUpdate(
        { _id: id },
        { $set: { isMute: true } },
        { new: true }
    )
}

const unmuteUser = (id) => {
    return User.findOneAndUpdate(
        { _id: id },
        { $set: { isMute: false } },
        { new: true }
    )
}

const banUser = (id) => {
    return User.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                isBanned: true,
                isOnline: false
            }
        },
        { new: true }
    )
}

const unBanUser = (id) => {
    return User.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                isBanned: false,
                isOnline: false
            }
        },
        { new: true }
    )
}

module.exports = {
    addConnection,
    userDisconnect,
    getOnlineUsers,
    muteUser,
    unmuteUser,
    getOfflineUsers,
    banUser,
    getUserByToken,
    unBanUser,
    getUser
}