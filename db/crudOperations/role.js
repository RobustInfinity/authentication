const Role = require('../models/Role');
const { mailer, uniqueId } = require('../../config/utils');
const { superAdminEmail } = require('../../config/config');
const dbOperations = {

    getRole:function(role,callback){
        Role.find(
            {
                "$or":[
                    { "type": role },
                    { "roleId": role }
                ]
            },
            {
                "_id":false
            }
        ).then(roles=>{
            if(!roles){
                callback(null,null);
            }
            else{
                callback(null,roles);
            }
        },err=>{
            callback(err,null);
        })
    },
    createRole:function(role,callback){
        var data = {};
        data.roleId = uniqueId.randomStringGenerate(8);
        data.type = role;
        Role.create(data, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, result);
            }
        });
    },
    fillRights:function(roleId,rights,callback){
        Role.update(
            {
                "roleId":roleId,
                
            },
            {
                "$set":{
                    "rights":rights
                }
            }
        ).then(role=>{
            if(!role){
                callback(null,null);
            }
            else{
                callback(null,role);
            }
        })
    },
    deleteRole:function(roleId,callback){
        Role.remove(
            {
                "roleId":roleId,
                "type":{
                    "$ne":"superadmin"
                }
            }
        ).then(success=>{
            if(!success){
                callback(null,null);
            }
            else{
                callback(null, success);
            }
        },err=>{
            callback(null,err);
        })
    },
    assignRole:function(userEmail,role,callback){
        const User = require('../models/User');
        User.update(
            {
                "email":userEmail
            },
            {
                "role":role
            }
        ).then(user=>{
            if(!user){
                callback(null,null);
            }
            else{
                callback(null,user);
            }
        },err=>{
            callback(err,null);
        });
    },
    loadRoles:function(callback){
        Role.find({
            "role":{
                "$ne":"superadmin"
            }
        }).then(result=> {
            if (!result) {
                callback(error,null);
            }
            else {
                callback(null,result);
            }
        },err=>{
            callback(err,null);
        })
    },
    createSuperAdmin:function(callback){
        const User = require('../models/User');
        User.find(
            {
                "role":"superadmin"
            }
        ).then(users=>{
            if(!users){
                callback(null,null);
            }
            else{
                if(users.length<1){
                    //No User As Super-Admin
                    var data = {};
                    data.firstName
                    data.email = superAdminEmail;
                    data.username = 'superadmin';
                    data.password = 'superadmin';
                    data.role = 'superadmin';

                    data.userId = uniqueId.randomStringGenerate(32);

                    //Create a user
                    User.create(data).then(user=>{
                        if(!user){
                            callback(null,null);
                        }
                        else{
                            mailer.createMail(user.email,"emailActivation");
                            callback(null,user);
                        }
                    })
                }
                else{
                    callback(null,users[0]);
                }
            }
        },err=>{
            callback(err,null);
        })
    }

    
}
module.exports = dbOperations;