const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


// const CourseSchema = require('./Course');

const UserSchema = new Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    userName :{
        type :String,
        required : true,
        unique:true
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    dob:{
        type: Date,
    },
    tokens:[{
        token:{type:String},
        access:{type:String},
        expiresAt:{type:Date}
    }],
    role:{
       type:String,
    },
    course:[
        {

            type:String,
            // ref:'course'
        
        }
    ]
});


UserSchema.pre('save',function(next){


    let user = this;
// console.log("user",user,user.isModified('password'))
    if(user.isModified('password')){
        bcrypt.genSalt(10 ,(err, salt)=>{
            //salt gen for 10 rounds
            // console.log("hashing password",err);

            bcrypt.hash(user.password, salt, (err, hash)=>{
                // console.log("hashing password",hash);
                //hashing paswword with salt
                // console.log("user is ",user);
                user["password"] = hash;

                
                // console.log("user is ",user);
                //hashed password 
                //Saving user with hashed password
                //next call to middle ware
                return next();//save will be called now
                
            })
        });
    }
    else{
        next();

    }
    // console.log("May be creating error");

});

UserSchema.index({ userId: 1 });
UserSchema.index({ username: 1 });



module.exports = User = mongoose.model('users', UserSchema);