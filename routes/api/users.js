const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const {SECRET_KEY,FAIL, BAD_REQUEST, SUCCESS, SERVER_ERROR, UNAUTHORIZED, UNKNOWN} = require("../../config/keysPassport/keys");
const bcrypt = require('bcryptjs');


const { sendResponse }= require("../../config/utils/responser");
//responser.sendResponse(response,"message",code,data,specialMessage);



//Email

const {mailer,sessionHandler} = require('../../config/utils');
//DB operation
const dbOperation = require('../../db/crudOperations/user');

//utils
const _ = require('../../utils/lodash');
//Validations
const registerInputValidate = require('../../validations/register');
const loginInputValidate = require('../../validations/login');




//@route GET /api/users/test
//@description Test Users Route
//@access Public
router.get('/test',(request,response)=>{
    // response.json({"message":SUCCESS});
    sendResponse(response,SUCCESS)
});

//@route POST /api/users/register
//@description Register Users Route
//@access Public
router.post('/register',(request, response)=>{

    let body = _.pick(request.body, ["firstName","lastName","email","dob","password","confirmPassword","userName"]);

    const { errors, isValid } = registerInputValidate(body);
    if(!isValid){
        console.log(isValid)
        sendResponse(response,FAIL,null,errors)
    }
    else{
        dbOperation.findByEmail(body.email,(error,user)=>{
            if(error){
                console.log(error);
                sendResponse(response,FAIL,null,error)
            }
            else{
                // console.log(user);
                if(user){
                    console.log("user already exist")
                    sendResponse(response,BAD_REQUEST,null,"user already exist");
                }
                else{

                    let userData = _.pick(body,["firstName","userName","lastName","email","dob","password","confirmPassword"]);

                    dbOperation.register(userData,(error1,result1)=>{
                        if(error1){
                            console.log(error1);
                            
                            // response.status(400).json({"message":FAIL,"register":FAIL,"errorOccured":true});
                            sendResponse(response,FAIL,null,error1)
                        }
                        else{
                            if(!result1){
                                console.log(error1);
                                sendResponse(response,BAD_REQUEST,null,error1)
                                // console.log(body);
                            }
                            else{
                                console.log("created user successfully")
                                // response.json({ "message":SUCCESS, "register":SUCCESS,"user":result1});
                                sendResponse(response,SUCCESS,null,"created user successfully");
                            }
                    // dbOperation.register(body,(error1,result1)=>{
                    //     if(error1){
                    //         console.log(error1);
                    //         sendResponse(response,FAIL,null,error1);
                    //     }
                    //     else{
                    //         if(!result1){
                    //             sendResponse(response,BAD_REQUEST,null,error1);

                    //         }
                    //         else{
                    //             console.log("created user successfully")
                    //             // response.json({ "message":SUCCESS, "register":SUCCESS,"user":result1});
                    //             sendResponse(response,SUCCESS,null,"created user successfully");

                    //         }
                    //     }
                    // });
                
    
                // }
            }
            
        })
    }
}})}})

//@route POST /api/users/avatarUpload
//@description Upload Registered User Avatar
//@access Private
router.post('/uploadAvatar',passport.authenticate("jwt",{ session: false }),(request,response)=>{
    const errors = {};
    upload(request, response, (err,result) => {
        if(err){
            
            sendResponse(response,FAIL,null,err);

        } else {
          if(request.file == undefined){
            sendResponse(response,FAIL,null,"No file selected");
          } else {
            dbOperation.registerAvatar(request,result,(error,result2)=>{
                if(error){
                    sendResponse(response,FAIL,null,"No user for these credentials");
                }
                else{
                    if(!result2){
                        sendResponse(response,BAD_REQUEST,null,"Not valid userId")
                    }
                    else{
                        sendResponse(response,SUCCESS,null,"upload image success")
                    }
                }
            });

          }
        }
      });
});


// Set The Storage Space
const storage = multer.diskStorage({
    destination: './public/image/users/avatar/',
    filename: function(request, file, cb){
        cb(null, request.user.userId
            + '-' 
            + 'avatar'
            + path.extname(file.originalname));
        }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1024*1024*10 },//10Mb
    fileFilter: function(request, file, cb){
        checkFileType(file, cb);
    }
}).single('avatar');

// Check File Type
function checkFileType(file, cb){
    // Allowed extension
    const filetypes = /jpeg|jpg|png|/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
    return cb(null,true);
    } else {
    cb('Error: Images Only(supported JPEG/JPG/PNG!)');
    }
} 

//@route POST /api/users/login
//@description Login Users Route
//@access Public
router.post('/login',(request,response)=>{
    let body = _.pick(request.body, ["email","password"]);
    const { errors, isValid } = loginInputValidate(body);
    if(!isValid){
        // resposne.status(400).json({"message":"dataError","errors": errors });
        sendResponse(response,FAIL,null,errors)
    }
    else{
        dbOperation.findByCredentials(body.email,body.password,(error,result)=>{
            if(error){
                errors.error = error;
                sendResponse(response,SERVER_ERROR,null,errors)
                // response.status(500).json({"message":"server error", "login": FAIL, "errorOccured":true,errors})
            }
            else{
                if(!result){
                    errors.message = "User doesnot exist";
                    sendResponse(response,UNKNOWN,null,errors)
                    // response.status(404).json({"message":FAIL,"login":FAIL,"errors":errors});
                }
                else if(result && Object.keys(result).length===0){
                    // console.log("Result is Empty Object");
                    errors.message = "Password Incorrect";
                    sendResponse(response,BAD_REQUEST,null,errors)
                    // response.status(404).json({"message":FAIL,"login":FAIL,"errors":errors});

                }
                else{
                    let user = result;
                    var user1 = {...user._doc};
                    // console.log(user1);
                    let user0 = Object.create(user1);
                    console.log(user1)
                    sessionHandler.fillSession(user, (err, session)=>{
                        var sessionToken = session.sessionId;
                        console.log("session",sessionToken);
                        dbOperation.putAuthToken(user0,sessionToken,(error1, usertoken)=>{
                            if(error1){
                                errors.tokenDbError = 'error while saving token in db';
                                sendResponse(response,SERVER_ERROR,null,error1)

                            }
                            else{
                                if(!usertoken){
                                    errors.absentToken = 'absent token';
                                    sendResponse(response,FAIL,null,errors)
    
                                }
                                else{
                                    console.log(usertoken===session.sessionId)
                                    sendResponse(response,SUCCESS,null,"login sucessfully")
                                    // response.json({"message":SUCCESS,"login":SUCCESS,"session":session})
    
                                }
                            }
                        })



                    });
                }
            }
        })
    }
});

//@route GET /api/users/resetPasswordTokenGenerator
//@description resetPasswordTokenGenerator Users Route
//@access Public
router.get('/forgotPassword/:email',(request,response)=>{
    var email = request.params.email;
    console.log(email);
    const errors ={};
    dbOperation.findByEmail(email,(error,user)=>{
        if(error){
            errors.error =error;
            sendResponse(response,FAIL,null,errors)
            // response.status(400).json({"message":FAIL,"forgotPassword":FAIL,"errorOccured":true,"errors":errors})

        }
        else{
            // console.log(user);
            if(!user){
                sendResponse(response,FAIL,null,errors)
                // response.status(400).json({"message":FAIL, "forgotPassword":FAIL ,"userDoesNotExist" : `User with email ${body.email} does not exist`});

            }
            else{
                let {userId, firstName, lastName, email} = user
                let payload = {
                    userId,
                    firstName ,
                    lastName,
                    email
                }

                    jwt.sign(payload, SECRET_KEY, { expiresIn : 5*60000 }, (err, token)=>{

                        if(err){
                            errors.error =err;
                            sendResponse(response,SERVER_ERROR,null,errors)
                            // response.status(500).json({ "message":FAIL, "forgotPassword":FAIL,"errors":errors });        
                        }
                        else{
                            if(!token){
                                var error = {jwtError:"Jwt token generation failed"};
                                errors.error = error;
                                sendResponse(response,FAIL,null,errors)
                                // response.status(400).json({ "message":FAIL, "forgotPassword":FAIL,"errors":errors });        

                            }
                            else{
                                var tokenData = {token, expiresIn : 5};
                                dbOperation.putResetToken(user,"resetPassword",tokenData,(error,result)=>{
                                    if(error){
                                        errors.error =error;
                                        sendResponse(response,FAIL,null,errors)
                                        // response.status(500).json({ "message":FAIL, "forgotPassword":FAIL,"errors":errors });        
                                    }
                                    else{
                                        if(!result){
                                            var error ={jwtError:"Jwt token generation failed"};
                                            sendResponse(response,FAIL,null,errors)
                                            // response.status(400).json({ "message":FAIL, "forgotPassword":FAIL,"errors":errors });        
                            
                                        }
                                        else{
                                            var data = {
                                                useremail: user.email,
                                                url: 'http://localhost:5000/api/users/resetPassword/'+result
                                            }
                                            mailer.createMail(data,"forgotPassword");
                                            //Later dont send token here...
                                            sendResponse(response,SUCCESS,null,SUCCESS)
                                            // response.json({ "message":SUCCESS, "forgotPassword":SUCCESS});
                                        }
                                    }
                                })
                            
                            }
                        }


                    });

            }
        }
        

    })
});


//@route POST /api/users/resetPasswordTokenGenerator
//@description resetPasswordTokenGenerator Users Route
//@access Public
router.post('/resetPassword/:token',(request, response)=>{
    // var token = request.params.token;
    const errors = {};

   dbOperation.validateToken(request,(error, token)=>{
        if(error){
            errors.message = "JsonWebToken Error";
            errors.error = error;
            sendResponse(response,SERVER_ERROR,null,errors)
        }
        else{
            var {userId} = token;
            var passwordObject = _.pick(request.body,["password","confirmPassword"]);
            var {password, confirmPassword} = passwordObject;
            var Token = request.params.token;
            if(password  && confirmPassword &&  (password === confirmPassword) ){
                // console.log("if case");
                console.log(userId)
                console.log(password)
                dbOperation.resetPassword(password,userId,Token,(error1,user)=>{
                    if(error1){
                        // console.log(error1);
                        errors.message = "No User found with that reset token request";
                        sendResponse(response,UNKNOWN,null,error1)
                    }
                    else{
                        if(!user){
                            // console.log(user);
                            errors.message = "Not Authenticated to change Password";
                            sendResponse(response,UNAUTHORIZED,null,errors)
                        }
                        else{
                            sendResponse(response,SUCCESS,null,SUCCESS)

                        }
                    }
                })

            }
            else{
                errors.message = "Password and confirm password must match";
                sendResponse(response,BAD_REQUEST,null,errors)

            }
        
        }
   });
    
});

//@route GET /api/users/resetUserNameTokenGenerator
//@description resetUserNameTokenGenerator Users Route
//@access Public
router.post('/forgotUserName/:email',(request, response)=>{
    var email = request.params.email;
    var password =request.body.password;
    var errors= {}
    dbOperation.findByEmail(email,(error, user)=>{
        if(error){
            errors.error = error
            // console.log(error)
            sendResponse(response,SERVER_ERROR,null,errors)
            // response.status(400).json({"message" : FAIL,"forgotUserName":FAIL,"errorOccured":true,"errors":errors})
        }else{
            if(!user){
                
                sendResponse(response,FAIL,null,errors)
                // response.status(400).json({"message":FAIL, "forgotUserName":FAIL ,"userDoesNotExist" : `User with email ${body.email} does not exist`});
            }else{
                // console.log(user)
                console.log(password)
                console.log(user.password);
                bcrypt.compare(password,user.password,(err, isMatch)=>{
                if(err){
                        errors.error =err
                        // console.log(err)
                        sendResponse(response,SERVER_ERROR,null,errors)
                        // response.status(400).json({"message" : FAIL,"forgotUserName":FAIL,"errorOccured":true,"errors":errors})
                    }
                else{
                    // console.log(user)
                    if(!isMatch){
                        console.log("isMatch")
                        console.log(errors);
                        errors.message = "Password Incorrect"
                        sendResponse(response,FAIL,null,errors)
                        // response.status(400).json({"message":FAIL, "forgotUserName":FAIL ,"wrongPassword" : `Invalid password for ${email}`})
                    }
                    else{
                        
                        let {userId, firstName, lastName, email} = user
                        let payload = {
                            userId,
                            firstName ,
                            lastName,
                            email
                        }
        
                        jwt.sign(payload, SECRET_KEY,{expiresIn : 5*6000},(err, token)=>{
                            if(err){
                                errors.error =err;
                                sendResponse(response,SERVER_ERROR,null,errors)
                                // response.status(500).json({ "message":FAIL, "forgotUserName":FAIL,"errors":errors });        
                            }
                            else{
                                if(!token){
                                    var error = {jwtError:"Jwt token generation failed"};
                                    errors.error = error;
                                    console.log(errors)
                                    sendResponse(response,FAIL,null,errors)
                                    // response.status(400).json({ "message":FAIL, "forgotUserName":FAIL,"errors":errors });        
        
                                }
                                else{
                                    var tokenData = {token, expiresIn : 5};
                                    dbOperation.putResetToken(user,"resetUserName",tokenData,(error,result)=>{
                                    if(error){
                                        errors.error =error;
                                        console.log(errors)
                                        sendResponse(response,SERVER_ERROR,null,errors)
                                        // response.status(500).json({ "message":FAIL, "forgotUserName":FAIL,"errors":errors });        
                                    }
                                    else{
                                        if(!result){
                                            var error ={jwtError:"Jwt token generation failed"};
                                            console.log(errors)
                                            sendResponse(response,FAIL,null,errors)
                                            // response.status(400).json({ "message":FAIL, "forgotUserName":FAIL,"errors":errors });        
                            
                                        }
                                        else{
                                            var data = {
                                                useremail: user.email,
                                                url: 'http://localhost:5000/api/users/resetUserName/'+result
                                            }
                                            console.log(data);
                                            mailer.createMail(data,"forgotUserName");
                                            //Later dont send token here...
                                            sendResponse(response,SUCCESS,null,SUCCESS)
                                            // response.json({ "message":SUCCESS, "forgotUserName":SUCCESS});
                                        }
                                        }
                                    })
                                
                                }
                        }
                    }

                        )}
                        }
                })
            }
            }
        }
    )
})

router.post('/resetUserName/:token',(request, response)=>{
    // var token = request.params.token;
    const errors = {};

   dbOperation.validateToken(request,(error, token)=>{
        if(error){
            errors.message = "JsonWebToken Error";
            errors.error = error;
            sendResponse(response,FAIL,null,errors)
            // response.json({ "message":FAIL, "resetUserName":FAIL,"errorOccured":true,"errors":errors });

        }
        else{
            var {userId} = token;
            var {userName} = request.body;
            var Token = request.params.token;
            console.log(userId);
                dbOperation.resetUserName(userName,userId,Token,(error1,user)=>{
                    // console.log("Reset password",error1);
                    if(error1){
                        console.log(error1);
                        errors.message = "No User found with that reset token request";
                        sendResponse(response,UNKNOWN,null,errors)
                    }
                    else{
                        if(!user){
                            errors.message = "Not Authenticated to change UserName";
                            sendResponse(response,FAIL,null,errors)

                        }
                        else{
                            sendResponse(response,SUCCESS,null,SUCCESS)
                        }
                    }
                })

            // }
            // else{
            //     errors.message = "Password and confirm password must match";
            //     response.json({ "message":FAIL, "resetPassword":FAIL,"errorOccured":true,"errors":errors });

            // }
        
        }
   });
})
module.exports = router