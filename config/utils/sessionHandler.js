

const sessionHandler = {
    fillSession:function(userData,callback){
        //disabling fields
        userData.name = userData.firstName + userData.lastName;
        userData.firstName = undefined;
        userData.lastName = undefined;
        userData.password = undefined;
        userData.tokens = undefined;
        userData.dob = undefined;
        userData.course = undefined;
        userData._id = undefined;
        //remake obj 
        userData = userData.toObject();
        console.log("jwt payload",userData);
        const jwtOptions = require('../jwtOptions');
        jwtOptions.newJwtSession(userData,(error,session)=>{
            if(error){
                callback(error,null);
            }
            else{
                if(!session){
                   
                    callback(null,null);
                }
                else{
                    callback(null,session);
                }
            }
        });


    }
};
module.exports = sessionHandler;