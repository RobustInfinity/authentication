var {User} = require('./schema');

//middleware function
var authenticate = function(request, response, next){
    var token = request.header('x-auth');
    User.findByToken(token)
    .then((user)=>{
        if(!user){
            return Promise.reject();
        }
        console.log('authenticate');
        // response.send({id : user._id, email: user.email});
        request.token = token;
        request.user = user;
        next();
    })
    .catch((err)=>{
        response.status(401).send();
    })
}

module.exports = authenticate;