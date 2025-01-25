const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,  
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String
    },
    about:{
        type:String,
        
    },
    friends: [
        {
            type: ObjectId,
            ref: 'users', // References the users schema 
            
        },
    ]
})  

const users = mongoose.model("users",userSchema)

module.exports = users