require('dotenv').config()
const express = require("express")
const cors = require("cors")
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('./database/dbConnection')
const router = require('./routes/router')

const hOutServer = express()
const server = createServer(hOutServer);
const io = new Server(server);

hOutServer.use(cors())
hOutServer.use(express.json())
hOutServer.use(router)
hOutServer.use('/uploads', express.static('./uploads'))

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => {
    console.log(`hOutServer in running on the ${PORT} and wating for client request!!!`);
})

hOutServer.get("/", (req, res) => {
    res.status(200).send(`<h1 style="color:cyan;">hOutServer Stareted at port ${PORT} and waiting for client request !!!</h1>`)
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });