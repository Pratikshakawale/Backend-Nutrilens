require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI

const connectToMongo = async ()=>{
    await mongoose.connect(mongoURI)
}
mongoose.set('strictQuery', true)
module.exports = connectToMongo;