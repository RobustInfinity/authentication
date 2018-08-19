var {mongoose} = require('./connection');
var {User} = require('./schema');

var operations = {
    add : function(request, response, obj){
        var user = new User({
            email: obj.email,
            password: obj.password
        })
        User.create(user)
        .then((result)=>{
            response.send(result);
            console.log(result);
        }).catch((err)=>{
            response.status(400).send(err);
            console.log(err);
        })
    }
}

module.exports = {operations};