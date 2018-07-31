var express = require('express');
var router = express.Router();
var passport = require('passport');

var csurf = require('csurf');


router.get('/login',(req,res,next)=>{
    if(req.isAuthenticated()&&req.user.roles==="ADMIN"){
                res.redirect('/admin/dashboard');
    }else {
        next();
    }

},(req,res,next)=>{
    var messages = req.flash('errors');
    res.render('./admin/login',{
            csrfToken : req.csrfToken(),
            messages : messages
    });
});


router.post('/login',passport.authenticate(
    'local.admin',{
         successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login' 

}));

router.get('/dashboard',(req,res,next)=>{

    if(req.isAuthenticated()&&req.user.roles==="ADMIN"){
        res.locals.admin = req.user;
        res.locals.logged = req.isAuthenticated();
        next();
    }else {
        res.redirect('/admin/login');
    }

},(req,res,next)=>{
        res.render('./admin/dash_board');
});


module.exports = router;

