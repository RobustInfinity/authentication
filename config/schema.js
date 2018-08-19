var {mongoose} = require('./connection');
var validator = require('validator');

var Schema = mongoose.Schema;


var UserSchema = new Schema({
    email : {
        type: String,
        required : true,
        trim: true,
        unique: true,
        minlength : 1,
        validate : {
            validator : validator.isEmail,
            message : '{VALUE} is not a valid email'
        }
    },
    password : {
        type : String,
        required : true,
        minlength: 5
    },
    tokens :[{
        access :{
            type : String,
            required : true
        },
        token : {
            type: String,
            required: true
        }
    }]
})

var User = mongoose.model('User', UserSchema);

module.exports = {User};