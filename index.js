require('dotenv').config()
const express = require("express")
const cors = require("cors")
require('./database/dbConnection')
const router = require('./routes/router')
const http = require("http");
const { Server } = require("socket.io");

const hOutServer = express()

hOutServer.use(cors())
hOutServer.use(express.json())
hOutServer.use(router)
hOutServer.use('/uploads', express.static('./uploads'))

const server = http.createServer(hOutServer);

const PORT = 3000 || process.env.PORT

const io = new Server(server, {
  cors: {
    pingTimeout: 60000,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join room", (ChatId) => {
    socket.join(ChatId);
    console.log(`User with ID: ${socket.id} joined room: ${ChatId}`);
  });

  socket.on("chat message", (reqBody) => {
    socket.to(reqBody.ChatId).emit("receive message",reqBody);
    console.log(reqBody);
    
  });



  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
})

server.listen(PORT, () => {
  console.log(`hOutServer in running on the ${PORT} and wating for client request!!!`);
})

hOutServer.get("/", (req, res) => {
  res.status(200).send(`<h1 style="color:black;">hOutServer Stareted at port ${PORT} and waiting for client request !!!</h1>`)
})

