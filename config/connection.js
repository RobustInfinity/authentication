var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/CRUD',{useNewUrlParser: true},()=>{
    console.log('Database connected ');
})

module.exports = {mongoose};