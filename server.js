const express = require('express')
const app = express()
const server = require('http').createServer(app)
const mongoose = require('mongoose')
const keys = require('./config/keys')
const port = process.env.port || 5000
const cors = require('cors');
const userRoutes = require('./routes/user')
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('morgan')('dev'))
const webSocketController = require('./controllers/webSocketController');

mongoose.connect(keys.mongoUri, { useNewUrlParser: true })
  .then(() => { console.log('mongoDB has been connected') })
  .catch((error) => console.log(error))

app.use('/', userRoutes)

server.listen(port, () => {
  console.log(`Server listening at port ${port}`)
})

io.use(webSocketController.middleware)
io.on('connection', webSocketController.onConnect)


