const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    groupId:{
        type:String,
        required:[true,"Group Id is required"],

    },
    name:{
        type:String,
        required:[true,"Group Name is required"]
    },
    members:[{
        userId:String
    }],
    SubjectId:[
        String
    ]
}); 
module.exports = Group = mongoose.model('group',GroupSchema);
/**
 * A group is a unique collection of users
 * CSE 2017 Sem 1 is a group.
 * Every unique group has collectiojnof subjects they had Ids of subjects.
 */