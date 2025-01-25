const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'users', // References the users schema
        required: true
    },
    username: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    media: {
        type: String
    },
    likes: {
        type: Array
    },
    comments: [
        {
            userId: {
                type: String
            },
            comment: {
                type: String
            },
            username: {
                type: String
            },
            userProfilePic: {
                type: String
            }
        }
    ],
    savedUsers: {
        type: Array
    }
});

const posts = mongoose.model('posts', postSchema);

module.exports = posts;
