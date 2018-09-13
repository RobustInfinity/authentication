const User = require('../models/User');
const randomString = require('randomstring');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../../config/keysPassport/keys");


const dbOperation = {

    findByUserId:function(userId){
       return User.findOne({ userId: userId }).then(result => {
            return Promise.resolve(result);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    findByEmail:function(email,callback){
        User.findOne({email: email },(error,result)=>{
            if(error){
                callback(error,null);
            }
            callback(error,result);
        });
    },
    register:function(userData,callback){
        const { uniqueId } = require('../../config/utils'); 

        var userId = uniqueId.randomStringGenerate(32);
      
       var user = new User({...userData,userId});
        user.save(function(err,result){
            if(err){
                callback(err, null);
            }
            else{
                if(!result){
                    // const error = {};
                    callback(null, null);//Save erorr
                }
                else{
                    // console.log("result is ",result);
                    callback(null, result);//Successfully saved
                }
               
            }
        });
    },
    findByCredentials:function(loginId,password,callback){
        User.findOne(
           { 
               "$or":[
                    { "email": loginId },
                    { "username": loginId }
                ]
            },
            (error, result)=>{
            if(error){
                callback(error,null);
            }
            else{
                if(!result){
                    callback(null,null);
                }
                else{
                    let user = result;
                    console.log(result);
                    bcrypt.compare(password, user.password,(err,isMatch)=>{
                        if(err){
                            throw err;
                        }
                        else{
                            if(!isMatch){
                                callback(null, {});
                            }
                            else{
                                callback(null, user)
                            }
                        }
                    }); 
                    // callback(null, user);
                }
            }
        })
    },
    putResetToken:function(user,access,tokenData,callback){

        //change token to tokendata
        var dateInstance = new Date();
        var {token, expiresIn} = tokenData;//5 Minutes expiration
        // console.log("1",user);
        user.tokens.push({
            "token":token,
            "access":access,
            "expiresAt": new Date(dateInstance.setTime(dateInstance.getTime() + expiresIn*60000))//5 Minutes expiration
        });
        console.log("current time " +  dateInstance)
        console.log("5 min. " + new Date(dateInstance.setTime(dateInstance.getTime() + expiresIn*60000)))
        console.log("2",user);
        user.save(function(error1,result1){
            if(error1){
                console.log("put resetPassword token err", error1);

                callback(error1, null);
            }
            else{
                if(!result1){
                    console.log("put resetPassword token exp", error1);

                    callback(error1, null);
                }
                else{
                    console.log("put resetPassword token err", result1);

                    callback(null, token);
                }
            }
        });



    },
    putAuthToken:function(user0,token,callback){
        // User.findOne(
        //     {userId:user.userId},function(error, result){
        //     if(error){
        //         callback(error, null);
        //     }
        //     else{
        //         if(!result){
        //             callback(null, null);
        //         }
        //         else{
        //             var user = result;
        //             // user.tokens = [...user.tokens];
        //             console.log("1",user);
        //             user.tokens.push({
        //                 token:token,
        //                 access:"auth"
        //             });
        //             console.log("2",user);
        //             user.save(function(error1,result1){
        //                 if(error){
        //                     console.log("put auth token err", error1);

        //                     callback(error1, null);
        //                 }
        //                 else{
        //                     if(!result1){
        //                         console.log("put auth token exp", error1);

        //                         callback(error1, null);
        //                     }
        //                     else{
        //                         console.log("put auth token err", result1);

        //                         callback(null, token);
        //                     }
        //                 }
        //             });
                  
        //             console.log("3");

        //         }
        //     }
        // })
        
                    // console.log("1",user);
                    console.log("token\n",token);
                    // user0.tokens.push({
                    //     token:token,
                    //     access:"auth"
                    // });
                    User.findOneAndUpdate(
                    {
                        userId:user0.userId
                    },
                    {
                        $push:{
                            "tokens":{
                                "token":token,
                                "access":"auth",
                                
                            }
                        }
                    },
                    {
                        new:true
                    }
                    ).then(user=>{
                        if(!user){
                            callback(null,null);
                        }
                        else{
                            callback(null,token);
                        }
                    },err=>{
                        callback(err,null);
                    })
                    // console.log("2",user);
                    // user0.save(function(error1,result1){
                    //     if(error1){
                    //         console.log("put auth token err", error1);

                    //         callback(error1, null);
                    //     }
                    //     else{
                    //         if(!result1){
                    //             console.log("put auth token exp", error1);

                    //             callback(error1, null);
                    //         }
                    //         else{
                    //             console.log("put auth token err", result1);

                    //             callback(null, token);
                    //         }
                    //     }
                    // });
                  
    },
    validateToken:function(request,callback){
        var token = request.params.token;
        // console.log("TOKEN RESET PASSWORD IS",token);
        var decode;
        try{
            decode = jwt.verify(token,SECRET_KEY,(error,isMatch)=>{
                if(error){
                    // console.log("error",error);
                    callback(error, null);
                }
                else{
                    // console.log("isMatch",isMatch);
                    if(!isMatch){
                        var error = {"wrongJwt":"Wrong token"}
                        callback(error, null);
                    }
                    else{
                        decode = isMatch;
                        // console.log("decode",decode);
                        // var userId = decode.userId;
                        callback(null, isMatch); 
                    }
                }
            })
            

            
        }
        catch(exp){
            // console.log("exp",exp);
            callback(exp, null);
        }
    },
    resetPassword:function(password,userId,token,callback){
        
         bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,function(error,hash){
                if(error){
                    console.log(error);
                    // throw error;
                }
                // console.log("Hasing Passowrd",hash);
                password = hash;
                console.log("User Password Hashed ",password);
                var d = new Date();
                User.findOneAndUpdate({
                    "userId":userId,
                    "tokens":{
                        $elemMatch:{
                            "token":token,
                            "access":"resetPassword",
                            "expiresAt":{ $gt: d }
                        }
                        
                    }
                },
                {
                    $pull:{
                        "tokens":{
                            "token":token,"access":"resetPassword"
                        }
                    },
                    "password":password
                },{
                    new : true
                },
                function(error,result){
                    console.log(result)
                    console.log(error)
                    if(error){
                        callback(error, null);
                    }
                    else{
                        if(!result){
                            callback(null, null);
                        }
                        else{
                            callback(null, result);
        
                        }
                    }
                });
            })
        });
    },
    resetUserName : function(userName, userId, token, callback){
        console.log(userName)
        console.log(userId)
        var d = new Date();
                User.findOneAndUpdate({
                    "userId":userId,
                    "tokens":{
                        $elemMatch:{
                            "token":token,
                            "access":"resetUserName",
                            "expiresAt":{ $gt: d }
                        }
                        
                    }
                },
                {
                    $pull:{
                        "tokens":{
                            "token":token,"access":"resetUserName"
                        }
                    },
                    "userName":userName
                },{
                    new : true
                },
                function(error,result){
                    console.log(error)
                    console.log(result)
                    if(error){
                        callback(error, null);
                    }
                    else{
                        if(!result){
                            callback(null, null);
                        }
                        else{
                            callback(null, result);
        
                        }
                    }
                });
    },
    registerAvatar:function(request,result){

    }
    
}

module.exports = dbOperation;