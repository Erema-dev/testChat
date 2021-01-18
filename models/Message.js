const mongoose = require('mongoose')
const Schema = mongoose.Schema


const MessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    chatColor: {
        type: String
    },
    create_at: {
        type: Date
    }

})

module.exports = mongoose.model('messages', MessageSchema)