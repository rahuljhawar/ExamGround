//Including Mongoose model...
const mongoose = require('mongoose');
//creating object 
const Schema = mongoose.Schema;

//Schema for user
const userSchema = new Schema({

    name             : {type: String, required: true },
    email            : {type: String, required: true },
    mobileNumber     : {type: Number, required: true },
    password         : {type: String , required: true }

});

module.exports=mongoose.model('User',userSchema);