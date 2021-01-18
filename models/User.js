const { text } = require('body-parser')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    login: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    isOnline: {
        type: Boolean,
        required: true,
        default: false
    },

    isAdmin: {
        type: Boolean,
        default: false,

    },

    isMute: {
        type: Boolean,
        default: false
    },

    isBanned: {
        type: Boolean,
        default: false
    },

    chatColor: {
        type: String
    }


})

module.exports = mongoose.model('users', UserSchema)