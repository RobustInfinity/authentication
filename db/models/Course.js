const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const SubjectSchema = require('./Subject')
const CourseSchema = new Schema({
    courseId:{
        type:String,
        unique:true,
        required:[true,"Course Id is required"]
    },
    title : {
        type : String,
        required : true,
        unique : true
    },
    courseCode : {
        type : String,
        required :true,
        unique : true
    },
    createdAt:{
        type:Number,
        required:true,
        default : Date.now()
    },
    description : {
        type : String
    },
    branch : {
        type : String,
        required : true,
        unique : true
    },
    published : {
        type : String,
        required : true,
        unique : true
    },
    subjects:[{
        subjectId : {
            type:String,
            required : true
        },
        abbreviation : {
            type : String,
            required : true,
            unique : true
        }
    }]

});
module.exports = Course = mongoose.model('course',CourseSchema);