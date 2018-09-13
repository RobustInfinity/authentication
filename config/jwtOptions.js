const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./keysPassport/keys');
const Session = require('../db/models/Session');

const tokenOperations = {

    generateToken:function(payload,expiresIn){
        return jwt.sign(payload,SECRET_KEY,{ "expiresIn": expiresIn });
    },
    verifyToken:function(token,callback){
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
                        var error = { "message": "Wrong token" };
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
    newJwtSession:function(userData, callback){
        //pass userdata that is required for every request
        //email,username,userId,name
        var that = this;
        if(userData.userId){
            var DAYS_30 = 60 * 60 * 24 * 30;//60s * 1hr * 24hrs * 30days = seconds in 30 days 
            var token = that.generateToken(userData,DAYS_30);

            // userData._id = undefined;//else create mongo error=>prevent duplicate record error
            userData.sessionId = token;

            Session.find({
                "userId":userData.userId
            }).remove(function(error,result){
                if(error){
                    callback(error, null);
                }
                else{
                    that.storeSession(userData,callback);
                }
            })
        }
    },
    storeSession:function(userData,callback){
        Session.create(userData,function(error,result){

            if(error){
                callback(error,null)
            }
            else{
                callback(null,result);
            }
        });
    }

};
module.exports = tokenOperations;