const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const SubjectSchema = require('./Subject')
const ProgramSchema = new Schema({
    programId:{
        type:String,
        unique:true,
        required:[true,"Course Id is required"]
    },
    title :{
        type:String,
        unique:true,
        required:[true,"Course title is required"]
    },
    programCode : {
        type : String,
        unique : true,
        required : true
    },
    span:{
        type:Number,
        required:[true,"Course Span is required"]
    },
    createdAt:{
        type : Date,
        required : true,
        default : Date.now()
    },
    description :{
        type : String
    },
    published :{
        type : Boolean,
        required : true,
        default : false
    },
    courses: [{
        courseId: {
            type : String,
            required : true
        },
        abbreviation : {
            type : String,
            required : true
        }
    }]

});
module.exports = Program = mongoose.model('programs',ProgramSchema);