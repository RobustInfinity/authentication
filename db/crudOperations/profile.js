const Profile = require('../models/Profile');
const keys = require('../../config/keysPassport/keys');
const jwt = require('jsonwebtoken');


const dbOperations = {
    findProfileByUserId:function(userId,callback){
        // console.log("Query profile for data ",data);
        Profile.findOne({ userId:userId },function(error,profile){
            if(error){
                callback(error, null);
            }
            else{
                if(!profile){
                    callback(null, null);
                }
                else{
                    callback(null, profile);
                }
            }
        })
    },
    createProfile:function(data,callback){       
        let profile = new Profile(data);
        profile.save().then(profile=>{
            if(!profile){
                callback(null,null);
            }
            else{
                callback(null,profile);
            }
        },err=>{
            callback(err,null);
        })
    },
    verifyToken:function(token,callback){
        try{
            decode = jwt.verify(token.trim(),keys.secretOrKey,(error,isMatch)=>{
                if(error){
                    console.log("error",error);
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
            console.log("exp",exp);
            callback(exp, null);
        }
    },
    updateProfile:function(profile,updateProfileObj,callback){
        profile.update(updateProfileObj).then(updatedProfile=>{
            if(!updatedProfile){
                callback(null,null);
            }
            else{
                callback(null,updatedProfile);
            }
        },err=>{
            callback(err,null);
        })
    }
}
module.exports = dbOperations;