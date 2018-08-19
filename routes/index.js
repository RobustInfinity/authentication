var express = require('express');
var {operations} = require('../config/model');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/users',(request, response)=>{
    var email = request.body.email;
    var password = request.body.password;
    operations.add(request, response, {email, password});
})

module.exports = router;
