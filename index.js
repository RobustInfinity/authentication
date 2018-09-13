
//Express Dependency
const express = require('express');
//Body Parser
const bodyParser = require('body-parser');
//Passport
const passport = require('passport');
//Mongooose
const mongoose = require('mongoose');



//App
const app = express();
//Port of Node Js
const PORT = process.env.PORT || 5000;

//Middlewares

//Parse Http request 
app.use(bodyParser.urlencoded( { extended:false,limit: '11mb',parameterLimit: 1000000 } ));
//Put parse url on body of request obj. req.body
app.use(bodyParser.json({limit:'11mb'}));


//DB connection Config
const DB_URL = require('./config/keysPassport/keys').MONGO_URI;
//DB Connect 
mongoose.connect(DB_URL,{ useNewUrlParser: true }).then(()=>{
    console.log("Successfully connected to MongoDB");
}).catch((err)=>{
    console.log("Unable to connect to MongoDB ",err);
});

//Passport  Config
app.use(passport.initialize());
require('./config/keysPassport/passport')(passport);


//Routes imports

//Imports API
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//Routes Config

//Matches every request from /api/user to users routes Imports
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);




//int App 
const init = require('./config/init');
init.superAdmin();


app.listen(PORT,'localhost',()=>{
    console.log("Server Stated at ",PORT);
});