//Including Mongoose model...
const mongoose = require('mongoose');
//creating object 
const Schema = mongoose.Schema;

//Schema for user
const socialUserSchema = new Schema({

	id               : {type: String },
    name             : {type: String },
    email            : {type: String}
});

//model for userschema
module.exports = mongoose.model('SocialUser' , socialUserSchema);