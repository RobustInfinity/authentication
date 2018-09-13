const _ = require('../utils/lodash');
const isEmpty = _.isEmpty;
const isValidDate = _.isValidDate;
const Validator = require('validator');

function signupInputsValidate(input){
    const errors = {};
    console.log("Recived SignUp inputs as ",input);
        input.firstName = !isEmpty(input.firstName) ? input.firstName:'';
        input.lastName  = !isEmpty(input.lastName) ? input.lastName :'';
        input.email  = !isEmpty(input.email) ? input.email :'';
        input.userName = !isEmpty(input.userName) ? input.userName : '';
        input.password  = !isEmpty(input.password) ? input.password :'';
        input.confirmPassword = !isEmpty(input.confirmPassword) ? input.confirmPassword :'';
        input.dob  = !isEmpty(input.dob) ? input.dob :'';
    
    //First Name
        if(!Validator.isLength(input.firstName,{ min:2, max:30 })){
            errors.firstName= 'First Name length to be min:2, max:30 ';
        }
        if(isEmpty(input.firstName)){
            errors.firstName = 'First name is Required';
        }
    //Last Name
        if(!Validator.isLength(input.lastName,{ min:2, max:30 })){
            errors.lastName= 'Last Name length to be min:2, max:30 ';
        }
        
        if(isEmpty(input.lastName)){
            errors.lastName = 'Last name is Required';
        }
    //UserName
    if(!Validator.isLength(input.userName,{ min:2, max:30 })){
        errors.userName= 'UserName length to be min:2, max:30 ';
    }
    
    if(isEmpty(input.userName)){
        errors.userName = 'Username is Required';
    }
    //Email 
        if(!Validator.isEmail(input.email)){
            errors.email= 'Email Invalid';
        }
        if(isEmpty(input.email)){
            errors.email = 'Email Field is Required';
        }
    //Password
        if(!Validator.isLength(input.password,{ min:8, max:35 })){
            errors.password= 'Password length to be { min:8, max:35 }';
        }
        if(isEmpty(input.password)){
            errors.password = 'Password is Required';
        }
    //ConfirmPassword
        if(!Validator.equals(input.password,input.confirmPassword)){
            errors.confirmPassword = 'Password and confirm passwordmust match';
        }
        if(isEmpty(input.confirmPassword)){
            errors.confirmPassword = 'confirmPassword is Required';
        }
    //DOB validation later using monent js
        if(!isValidDate(new Date(input.dob))){
            errors.dob= 'DOB Must be a date';
        }
        if(isEmpty(input.dob)){
            errors.dob = 'DOB Field is Required';
        }
    

console.log("Errors occured in singupinputs are",errors);
return {
    errors:errors,
    isValid:isEmpty(errors)
}


}
module.exports = signupInputsValidate;