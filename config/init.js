/**
 * Purpose of this file is to create SuperAdmin to start Application.
 * It will be called when server start for first time.
 */
const ROLE = require('./role');
const configUrl = require('./configUrl');
//All possible Rights
const SUPER_ADMIN_URL = ROLE.superAdmin;
const ADMIN_URL = ROLE.admin;
const USER_URL = ROLE.user;
const SIMPLE_URL = ROLE.simple;

const init = {
    superAdmin:function(){
        var superAdminRights = [];

        // superAdminRights <= SUPER_ADMIN_URL
        Object.keys(SUPER_ADMIN_URL).forEach(function(key){
            for(var i = 0; i<SUPER_ADMIN_URL[key];i++){
                var rights = {
                    "name":SUPER_ADMIN_URL[key][i],
                    "path":key,
                    "url":key+SUPER_ADMIN_URL[key][i]
                };
                superAdminRights.push(rights);

            }
        });
        //superAdminRights <= ADMIN_URL
        Object.keys(ADMIN_URL).forEach(function(key){
            for(var i = 0; i<ADMIN_URL[key];i++){
                var rights = {
                    "name":ADMIN_URL[key][i],
                    "path":key,
                    "url":key+ADMIN_URL[key][i]
                };
                superAdminRights.push(rights);

            }
        });
        //superAdminRights <= USER_URL
        Object.keys(USER_URL).forEach(function(key){
            for(var i = 0; i<USER_URL[key];i++){
                var rights = {
                    "name":USER_URL[key][i],
                    "path":key,
                    "url":key+USER_URL[key][i]
                };
                superAdminRights.push(rights);

            }
        });
        //superAdminRights <= SIMPLE_URL
        Object.keys(SIMPLE_URL).forEach(function(key){
            for(var i = 0; i<SIMPLE_URL[key];i++){
                var rights = {
                    "name":SIMPLE_URL[key][i],
                    "path":key,
                    "url":key+SIMPLE_URL[key][i]
                };
                superAdminRights.push(rights);

            }
        });
         //superAdminRights <= confgUrl
         Object.keys(configUrl).forEach(function(key){
            for(var i = 0; i<configUrl[key];i++){
                var rights = {
                    "name":configUrl[key][i],
                    "path":key,
                    "url":key+configUrl[key][i]
                };
                superAdminRights.push(rights);

            }
        });
        const dbOperations= require('../db/crudOperations/role');
        dbOperations.createSuperAdmin((error,result)=>{
            if(error){
                console.log("error 0",error);
                process.exit();//1 is error code
            }
        });
        dbOperations.getRole('superadmin',(error,result)=>{
            if(error){
                console.log("error 1",error)

                process.exit();//1 is error code
            }
            else{
                if(result[0]){
                    dbOperations.fillRights(result[0].roleId, superAdminRights, (error,result)=>{
                        if(error){
                            console.log("error 2",error)

                            process.exit();
                        }
                    });
                }
                else{
                    dbOperations.createRole('superadmin',(error,result)=>{
                        if(error){
                            console.log("error 3",error);

                            process.exit();
                        }
                        else{
                            if(result){
                                dbOperations.fillRights(result.roleId, superAdminRights, (error,result)=>{
                                    if(error){
                                        console.log("error 4",error)

                                        process.exit();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
}
module.exports = init;