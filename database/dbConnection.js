const mongoose = require ('mongoose')

const connectionString = process.env.DBCONNECTIONSTRING

mongoose.connect(connectionString).then(res=>{
    console.log("MongoDB Atles Succesfully Connected with hOutServer");
    
}).catch(err=>{
    console.log("MongoDB Atles Connection Failed");
    console.log(err);
})