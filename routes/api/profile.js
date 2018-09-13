const router = require('express').Router();
const passport = require('passport');

//dbopertions
const dbOpertions = require('../../db/crudOperations/profile');

//utils
const _ = require('../../utils/lodash');
//validation
const basicProfileInputValidate = require('../../validations/basicProfileInput');



//@route GET /api/profile/test
//@description Test Profile Route
//@access Public
router.get('/test',(request,response)=>{
    response.json({"message":"success"});
});
//@route GET /api/profile/basic
//@description Basic Profile Route
//@access Private
router.post('/basic',passport.authenticate( 'jwt', { session: false } ),(request, response)=>{
    let body = _.pick(request.body,["username","status","bio","locationCountry","locationZip","website"])
    const { errors, isValid } = basicProfileInputValidate(body);
    if(!isValid){
        errors.message = "validation error";
        response.status(400).json({"basicProfile":"fail","message":"validation error","errorOccured":true,"errors":errors});
    }
    else{
        // console.log(request.body);
        // response.json(body);
        let token = request.header("Authorization");
        let bearerLength = "Bearer".length;
        token = token.substring(bearerLength);
        // console.log(token.userId);
        dbOpertions.verifyToken(token,(error,decodedToken)=>{
            
            if(error){
                errors.message = "Jwt token error";
                response.status(401).json({"message":"jwt token error","basicProfile":"fail","errorOccured":true,errors });

            }
            else{
                if(!decodedToken){
                    errors.message = "jwt toekn invalid";
                    response.status(401).json({"message":"jwt token error","basicProfile":"fail","errorOccured":true,errors });

                }
                else{
                    // let data = { username:body.username, userId:decodedToken.userId };
                    dbOpertions.findProfileByUserId(decodedToken.userId,(error,profile)=>{
                        // const errors = {};
                        if(error){
                            errors.message = "server error";
                            // errors = {...error};/
                            response.status(500).json({"message":"server error", "basciProfile": "fail", "errorOccured":true,errors})
                        }
                        else{
                            // console.log("profile is ",profile);
                            if(!profile){
                                let data2 = {...body, userId:decodedToken.userId };
                                let format = {
                                    ...data2,
                                    location:{
                                        countryCode:data.locationCountry,
                                        zipCode:data.locationZip
                                    }
                                };
                                // delete format.locationCountry;//unneccssary data
                                // delete format.locationZip;

                                dbOpertions.createProfile(format,(error,result)=>{
                                    if(error){
                                        errors.message = "error in profile creation";
                                        errors.errors = {...error}
            
                                        response.status(500).json({"message":"Error in profile creation", "basciProfile": "fail", "errorOccured":true,errors})
            
                                    }
                                    else{
                                        if(!result){
                                            errors.message = "error in profile creation";
                                            response.status(400).json({"message":"error in profile creation", "basciProfile": "fail", "errorOccured":true,errors})
                                        }
                                        else{
                                            response.json({"message":"profile created","basicProfile":"success"});
            
                                        }
                                    }
                                    
                                });
                            }
                            else{
                                let updateObj = _.pick(body,["status","bio","locationCountry","locationZip","website"])
                                //username update seprate route...
                                dbOpertions.updateProfile(profile,updateObj,(error, updatedProfile)=>{
                                    if(error){
                                        errors.message = "error while updating profile.";
                                        response.status(400).json({"message":"error while updating profile","basciProfile":"fail","errorOccured":true,"errors":errors});
                                    }
                                    else{
                                        if(!updatedProfile){
                                            errors.message = "error while updating profile.";
                                            response.status(400).json({"message":"error while updating profile","basciProfile":"fail","errorOccured":true,"errors":errors});
                                        }
                                        else{
                                           response.json({"message":"successfully updated","basicProfile":"success"}); 
                                        }
                                    }
                                });
                               
                            }
                        }
                    });
                }
            }
        })
        
    }
});
//@route GET /api/profile/education
//@description education Profile Route
//@access Private
router.post('/username',passport.authenticate('jwt',{ session: false }),(request,response)=>{
    
});
module.exports = router;




























                    


















                