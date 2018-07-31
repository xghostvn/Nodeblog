
var expess = require('express');

var router = expess.Router();

var passport = require('passport');


//register
router.get('/register',(req,res,next)=>{

    if(req.isAuthenticated()&&req.user.roles === "Member"){
        res.redirect('/');

    }else {
        next();
    }


},(req,res,next)=>{
    var messages = req.flash('error');
    res.render('./members/register',{
        messages : messages,
        csrfToken : req.csrfToken()
    });

});

router.post('/register',
passport.authenticate(
    'local.registry', {
        successRedirect: '/',
        failureRedirect: '/member/register' 

    }));


//login
    router.get('/login',(req,res,next)=>{

        if(req.isAuthenticated()&&req.user.roles === "Member"){
            res.redirect('/');
        }else {
            next();
        }
        

    },(req,res,next)=>{
        var messages = req.flash('error');
        res.render('./members/login',{
            messages:messages,
            csrfToken : req.csrfToken()
        });

    });

    router.post('/login',passport.authenticate(
        'local.login',{
            successRedirect: '/',
            failureRedirect: '/member/login' 
        }
    )
        
    );

    //logout 

    router.get('/logout',(req,res,next)=>{
        req.logout();
        res.redirect('/member/login');
    });



    router.get('/facebook',passport.authenticate('facebook',{
        scope:'email'
    }));


    router.get('/facebook/callback',passport.authenticate('facebook',{

        successRedirect : '/',
        failureRedirect : '/member/login'

    }));








module.exports = router;