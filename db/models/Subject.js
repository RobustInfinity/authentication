const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    subjectId:{
        type:String,
        required:[true,"Subject Id is required"]
    },
    title:{
        type:String,
        unique : true,
        required:[true,"Subject title is required"]
    },
    createdAt : {
        type : Date,
        required : true,
        default  :Date.now()
    },
    abbreviation : {
        type : String,
        required : true,
        unique : true
    },
    subjectCode : {
        type : String,
        required : true,
        unique : true
    },
    description : {
        type : String,
        required : true
    },
    semester : {
        type : Number,
        required : true
    },
    year : {
        type : Number,
        required : true
    },
    published : {
        type : Boolean,
        required : true,
        default : false
    }
});
module.exports = Subject = mongoose.model('subject',SubjectSchema);
/**
 * Subject is a unique.
 * A change of Syllbus create a new subject.
 * 
 */