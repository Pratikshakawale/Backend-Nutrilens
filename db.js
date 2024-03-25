require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,(err)=>{
        if(!err){
            console.log("Connected to MongoDB server")
        }
    })
}
mongoose.set('strictQuery', true)
module.exports = connectToMongo;