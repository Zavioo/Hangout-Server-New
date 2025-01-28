const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
}, { timestamps: true })

const Chats = mongoose.model("Chats", chatSchema)

module.exports = Chats