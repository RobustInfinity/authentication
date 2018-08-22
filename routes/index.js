var express = require('express');
var {operations} = require('../config/model');
var router = express.Router();
var authenticate = require('../config/authenticate');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/users/add',(request, response)=>{
    var email = request.body.email;
    var password = request.body.password;
    operations.add(request, response, {email, password});
    // response.header('x-auth',token).send()
})

//using authenticate as middleware function
router.get('/users/user',authenticate,(request, response, next)=>{
    operations.message('Message');
})

router.post('/users/login',(request, response)=>{
    var email = request.body.email;
    var password = request.body.password;
    var result = operations.login(request, response, {email, password}); 
})

router.post('/users/delete',authenticate,(request, response)=>{
   operations.delete(request, response, request.user, request.token);  
})
module.exports = router;
