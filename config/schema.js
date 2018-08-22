const {mongoose} = require('./connection');
const validator = require('validator');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
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


UserSchema.methods.generateAuthToken = function(){
    // var user = this;
    var access = 'auth';
    var token = jwt.sign({'_id': this._id.toHexString(),access},'abc123').toString();

    this.tokens.push({access,token});

    return token;
}

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token,'abc123');
        console.log(decoded);
    } catch(e){
        return Promise.reject();
    }

    return User.findOne({
        '_id' : decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    })
}

UserSchema.methods.removeToken = function(token){

    return User.update({
        $pull : {
            tokens : [{token}]
        }
    })
}

UserSchema.pre('save',function(next){
    // var user = this;
    if(this.isModified('password')){
        bcrypt.genSalt((err, salt)=>{
            bcrypt.hash(this.password,salt,(err, hash)=>{
                this.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})
var User = mongoose.model('User', UserSchema);

module.exports = {User};