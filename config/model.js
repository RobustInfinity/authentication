var {mongoose} = require('./connection');
var {User} = require('./schema');
var bcrypt = require('bcryptjs');

var operations = {
    add : function(request, response, obj){
        var user = new User({
            email: obj.email,
            password: obj.password
        })
        // var token = user.generateAuthToken();
        User.create(user)
        .then((result)=>{
            response.send(result);
        }).catch((err)=>{
            response.status(400).send(err);
            console.log(err);
        })
    },
    message : function(message){
        console.log(message)
    },
    login : function(request, response, obj){
        User.findOne({
            'email' : obj.email
        },(err, user)=>{
            if(user){
            bcrypt.compare(obj.password, user.password,(err, success)=>{
                if(success){
                    console.log(user);
                    var token = user.generateAuthToken();
                    console.log(user);
                    User.create(user)
                    .then((result)=>{
                        response.header('x-auth' , token).send({'email' : result.email});
                    })
                    .catch((err)=>{
                        response.send(err); 
                    })
                }
                else{
                    response.send('Incorrect Password')
                }
                if(err){
                    response.send(err);
                }
            }
            )}
            if(err){
                response.send(err);
            }
        })
    },
    delete : function(request, response, user, token){
        
        user.removeToken(token)
        .then((result)=>{
            console.log(result);
            response.send(result);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
}

module.exports = {operations};