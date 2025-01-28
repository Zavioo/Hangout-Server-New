const mongoose = require('mongoose');

const massageSchema = new mongoose.Schema({
    sender: {
        type: String
    },
    content: {
        type: String
    },
    ChatId: {
        type: String

    },
})

const Massage = mongoose.model("Massage", massageSchema)

module.exports = Massage