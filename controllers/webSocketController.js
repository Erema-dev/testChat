const User = require('../models/User')
const { sendMessage, getMessage } = require('../services/messageService')
const {
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
} = require('../services/userService')


const middleware = async (socket, next) => {

    const user = await getUserByToken(socket.handshake.query.token);

    if (!user) {
        console.log('not a user')
        socket.disconnect();
        return next();
    }

    if (user.isBanned) {
        console.log('ban')
        socket.disconnect();
        return next();
    }

    if (users[user._id]) {
        console.log('kick')
        socket.to(ids[user._id]).emit('kick', {})
        users[user._id].disconnect();
    }

    socket.user = user;
    return next();
};


users = {}
ids = {}

const onConnect = async (socket) => {

   const getUsers = async() => {
        if (socket.user.isAdmin) {
            socket.server.sockets.emit('offline users', await getOfflineUsers())
        }
        socket.server.sockets.emit('online users', await getOnlineUsers())
   }


    users[socket.user._id] = socket
    ids[socket.user.id] = socket.id


    socket.emit('user join', await addConnection(socket.user))
    socket.emit('get messages', await getMessage())
    socket.server.sockets.emit('new user', `${socket.user.login} join the chat`)
    await getUsers()

    //Новое сообщение
    socket.on('new message', async (data) => {
        if (!socket.user.isMute) {
            socket.server.sockets.emit('new message', await sendMessage(data, socket.user))
        }
    })

    socket.on('logout', async (data) => {
        users[data].disconnect()
        await getUsers()
    })

    socket.on('disconnect', async (data) => {
        delete users[socket.user._id]
        delete ids[socket.user._id]
        await userDisconnect(socket.user._id)
        socket.server.sockets.emit('user left', socket.user.login)
        await getUsers()
    });

    if (socket.user.isAdmin) {
    
        socket.on('mute user', async (data) => {
            await muteUser(data)
            if (users[data]) {
                users[data].user = await getUser(data)
                socket.to(ids[data]).emit('you mute', users[data].user)
            };

           await getUsers()
           
        })

        socket.on('unmute user', async (data) => {
            await unmuteUser(data)
            if (users[data]) {
                users[data].user = await getUser(data)
                socket.to(ids[data]).emit('you unmute', users[data].user)
            };

            await getUsers()
            
        })

        socket.on('ban user', async (data) => {
            socket.to(ids[data]).emit('you ban', await banUser(data))

            if (users[data]) { 
                users[data].disconnect() 
            };

            await getUsers()
        })

        socket.on('unban user', async (data) => {
            await unBanUser(data)
            await getUsers()
        })
    }


}

module.exports = {
    onConnect,
    middleware
}
