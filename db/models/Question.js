const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CourseSchema = require('./Course');
const QuestionSchema = new Schema({
    questionId:{
        type:String,
        required:[true,"Question Id is required"]
    },
    question:{
        type:String,
        required:[true,"Question heading is required"]

    },
    options:[{
        type:String,
    }],
    answer:{
        type:String,
        required:[true,"Question correct-answer is required"]
    },
    course:{
        type:CourseSchema,
        required:[true,"Question Course is required"],
        ref:'Course'
    },
    unit:{
        type:String,
        required:[true,"Question unit is required"]
    },
    tag:{
        type:String,
        required:[true,"Question tag is required"]
    },
    author:{
        type:String,
        required:[true],
        ref:'user'
    }
    
});
module.exports = Question = mongoose.model('question',QuestionSchema);