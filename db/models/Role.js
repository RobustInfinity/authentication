const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    roleId:{
        type:String,
        unique:true,
        required:[true,"Role Id required"]
    },
    type:{
        type:String,
        unique:true,
        required:[true,"Role type is required"]
    },
    rights:[{
        name: String,
        path: String,
        url: String
    }]
    
});
module.exports = Role = mongoose.model('role',RoleSchema);

/**
 * Role type:
 *      1)SuperAdmin=>value=3(optional path)
 *      2)Admin=>value=2
 *      3)User=>value=1
 *      4)Guest=>value=0
 */