var express = require('express');
var router = express.Router();

const home_controller = require('../controller/home_controller');


/* GET home page. */
router.get('/',(req,res,next)=>{
   
        if(req.isAuthenticated()&&req.user.roles === "Member"){
            res.locals.logged = req.isAuthenticated();
           return next();
        }else {
            res.redirect('./member/login');
        }


}, home_controller.index);






module.exports = router;
