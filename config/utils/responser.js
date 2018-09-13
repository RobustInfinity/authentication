var {FAIL, SERVER_ERROR, UNAUTHORIZED, UNKNOWN, SUCCESS, BAD_REQUEST} = require('../keysPassport/keys')

const responser = {
    sendResponse:function(response,message,code,data,special){
        var responseObj = {
            message:message
        };
        if(data){
            data = data || "";
            responseObj.data = data;
        }
        
        // if(data instanceof Error){

        //     responseObj.errors = data;
        // }
        // else{

        //     responseObj.data = data;

        // }
        switch(message){
            case FAIL:
                //error occured
                code = code || 403;
                responseObj.code = code;
                special = special || "Forbidden";
                response.special = special;

                response.status(code).json(responseObj);
                break;
            case SERVER_ERROR :
                //server-error
                code = code || 500
                responseObj.code =code
                special = special || ""
                response.status(code).json(responseObj);
                break;
            case SUCCESS:
                //operation success
                code = code || 200;
                responseObj.code = code;
                special = special || "";
                response.special = special;
                response.status(code).json(responseObj);
                break;
            case UNKNOWN:
                //unkonow user
                code = code || 404;
                responseObj.code = code;
                special = special || "";

                response.status(code).json(responseObj);
                break;
            case UNAUTHORIZED:
                //not authorized to access
                code = code || 401;
                responseObj.code = code;
                special = special || "";
                response.special = special;

                response.status(code).json(responseObj);
                break;
            case BAD_REQUEST:
                //bad request to url some error in inputs
                code = code || 400;
                responseObj.code = code;
                special = special || "";
                response.special = special;

                response.status(code).json(responseObj);
                break;
        }
    }
};
module.exports = responser;