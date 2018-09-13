const router = require('express').Router();

const ROLE = require('../../config/role');
const dbOperations = require('../../db/crudOperations/role');



const SUPER_ADMIN_URL = ROLE.superAdmin;
const ADMIN_URL = ROLE.admin;
const USER_URL = ROLE.user;


router.get('/get-rights',(request,response)=>{
    response.json({"message":"success","get-rights":"success","data": { "urls":{ ...SUPER_ADMIN_URL,...ADMIN_URL,...USER_URL} } })
});
router.post('/load',(request,response)=>{
    dbOperations.loadRoles((error,result)=>{
        if(error){
            response.status(403).json({ "message": "fail", "load": "fail", "errors": error });
        }
        else{
            response.send({ "message":"success","load":"success","data":{ "roles": result } });

        }
    })
});
router.post('/create',(request, response)=>{
    var role = request.body.role;
    dbOperations.getRole(role,(error,result)=>{
        if(error){
            //utils.response(response,"message","data"); later use this
            response.json({ "message":"fail","create":"fail","errors":error })
        }
        else{
           
            if(result[0]){
                response.json({ "message":"role already exist","create":"fail" });
            }
            else{
                dbOperations.createRole(role,(error1,result1)=>{
                    if(error1){
                        response.json({ "message":"fail","create":"fail","errors":error });
                    }
                    else{
                        if(!result1){
                            response.send("create Role result null/undefined");
                        }
                        else{
                            response.json({ "message":"succesfully created roles","create":"success" })
                        }
                    }
                });
            }
            
        }
    })
});
router.post('/update-rights',(request,response)=>{
    var roleId = request.body.roleId;
   
    var inputRights = request.body.rights;

    var newRights = [];
    Object.keys(SUPER_ADMIN_URL).forEach(function(key){
        
        for(var i = 0; i<SUPER_ADMIN_URL[i].length;i++){
            if(inputRights.indexOf(SUPER_ADMIN_URL[key][i]) > -1){
                var right = {
                    name: SUPER_ADMIN_URL[key][i],
                    path: key,
                    url: key + SUPER_ADMIN_URL[key][i]
                };
                newRights.push(right);
            }
        }

    });
    Object.keys(ADMIN_URL).forEach(function(key){
        for(var i = 0; i<ADMIN_URL[i].length;i++){
            if(inputRights.indexOf(ADMIN_URL[key][i]) > -1){

                var right = {
                    name: ADMIN_URL[key][i],
                    path: key,
                    url: key + ADMIN_URL[key][i]
                };
                newRights.push(right);
            }
        }
    });
    Object.keys(USER_URL).forEach(function(key){
        
        for(var i = 0; i<USER_URL[i].length;i++){
            if(inputRights.indexOf(USER_URL[key][i]) > -1){
                var right = {
                    name: USER_URL[key][i],
                    path: key,
                    url: key + USER_URL[key][i]
                };
                newRights.push(right);
            }
            
        }
    });
     

    dbOperations.fillRights(roleId,newRights,(error, result)=>{
        if(error){
            response.json({ "message":"fail","update-rights":"fail","errors":error });
        }
        else{
            response.json({"message":"Rights updated successfully","update-rights":"success"});
        }

    });
});
router.post('/delete', function (request, response) {


        dbOperations.deleteRole(request.body.roleId, (error, result) => {
            if (error) {
                response.json({ "message": "fail" });
            }
            else {
                response.send({ "message": "Role deleted success" });
            }
        });
    
    

});
router.post('/assign', function (request, response) {

    

    if (request.body.role!=='superadmin') {
        dbOperations.assignRole(request.body.email, request.body.role, (error, result) => {
            if (error) {
                response.json({ "message": "fail" });
            }
            else {
                response.send({ "message": "Role successfully assigned" });
            }
        });
    }
    else{
            response.json({ "message": "unknown"});
    }

});

module.exports = router;