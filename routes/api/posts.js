const router = require('express').Router();

//@route GET /api/posts/test
//@description Test Post Route
//@access Public
router.get('/test',(request,response)=>{
    response.json({"message":"success"});
});


module.exports = router;