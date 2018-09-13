const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
    testId:{
        type:String,
        required:[true,"Test Id is required"],
        unique:true
    },
    questions:[{
        type:QuestionSchema,
        ref:'question'
    }],
    subjects:[{
        type:SubjectSchema,
        required:[true,"Test Subject"]
    }],
    topic:{
        type:String,
        required:[true,"Test Topic is required"]
    },
    description:{
        type:String,
        
    }
});
module.exports = Test = mongoose.model('test',TestSchema);