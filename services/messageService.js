const Message = require('../models/Message')
const User = require('../models/User')
const keys = require('../config/keys')
const jwt = require('jsonwebtoken')

const sendMessage = async (data, user) => {
    const lastMess = await Message.findOne({ userName: user.login }).sort({ _id: -1 })

    if (data.text.length >200) {
        return false
    };

    if (((!lastMess) || (Math.floor((new Date() - lastMess.create_at) / 1000) > 5))) {
        const message = new Message({
            create_at: new Date(),
            userName: user.login,
            text: data.text,
            chatColor: user.chatColor
        });

        message.save();
        return message;
    }
}

const getMessage = async () => {
    return await Message.find({}).sort({ _id: -1 }).limit(20)
}

module.exports = {
    sendMessage,
    getMessage
}