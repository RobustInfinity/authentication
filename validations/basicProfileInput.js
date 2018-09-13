const _ = require('../utils/lodash');
const isEmpty = _.isEmpty;
const Validator = require('validator');

function basicProfileInputValidate (input){
    
    const errors = {};
    console.log("basicProfileInputValidate recived ",input);

        input.username ? !isEmpty(input.username) : '';
        input.status ? !isEmpty(input.status) :'';
        input.bio ? !isEmpty(input.bio):'';
        input.locationCountry ? !isEmpty(input.locationCountry):'';
        input.locationZip ? !isEmpty(input.locationZip):''
        input.website ? !isEmpty(input.website):'';

        //UserName validate
            if(!Validator.isLength(input.username,{ min:5,max:25 })){
                errors.username = 'UserName must be b/w 5 to 25 char long';
            }
            if(Validator.isEmpty(input.username)){
                errors.username = 'Username is required';
            }
        //status validate
            if(!Validator.isEmpty(input.status)){
                if(!Validator.isLength(input.status,{ min:4,max:200 })){
                    errors.status = 'status must be b/w 4 to 200 char long';
                }        
            }
            
         //Bio validate
            if(!Validator.isEmpty(input.bio)){
                if(!Validator.isLength(input.bio,{ min:4,max:40 })){
                    errors.bio = 'bio must be b/w 4 to 40 char long';
                }           
            }
            
            
        //location validate
            if(!Validator.isLength(input.locationCountry,{min:2,max:3})){
                errors.locationCountry = 'country code must be b/w 2 to 3 digits long';

            }
            if(Validator.isEmpty(input.locationCountry)){
                errors.locationCountry = 'locationCountry is required';
            }
            if(!Validator.isLength(input.locationZip,{min:4,max:6})){
                errors.locationZip = 'zip code must be b/w 4 to 5 digits long';

            }
            if(Validator.isEmpty(input.locationZip)){
                errors.locationZip = 'locationCountry is required';
            }  
        //website validate
            if(!Validator.isEmpty(input.website)){
                if(!Validator.isURL(input.website)){
                    errors.website = 'Website must must be a valid url';
                }
            }
            
            

   
    
    return {
        errors:errors,
        isValid:isEmpty(errors)
    }

}
module.exports = basicProfileInputValidate;