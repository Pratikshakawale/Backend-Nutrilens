const mongoose  = require("mongoose")

const findOrCreate = require('mongoose-findorcreate');


const UserSchema = new mongoose.Schema({
    "name" : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type: String,
    },
    number :{
        type : Number
    }
})


UserSchema.plugin(findOrCreate)

module.exports = mongoose.model("user", UserSchema);