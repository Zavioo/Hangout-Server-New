require('dotenv').config()
const express = require("express")
const cors = require("cors")
require('./database/dbConnection')
const router = require('./routes/router')

const hOutServer = express()


hOutServer.use(cors())
hOutServer.use(express.json())
hOutServer.use(router)
hOutServer.use('/uploads', express.static('./uploads'))

const PORT = 3000 || process.env.PORT

hOutServer.listen(PORT, () => {
    console.log(`hOutServer in running on the ${PORT} and wating for client request!!!`);
})

hOutServer.get("/", (req, res) => {
    res.status(200).send(`<h1 style="color:cyan;">hOutServer Stareted at port ${PORT} and waiting for client request !!!</h1>`)
})

