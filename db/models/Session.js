const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    sessionId:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:String,
        required:true,
    },
    name:{
        type:String,
    },
    email:{
        type:String,
        required: true
    },
    createdAt:{
        type:Date,
        expiresIn:"30d",
        default:Date.now()
    }
});
module.exports = Session = mongoose.model('session',SessionSchema);