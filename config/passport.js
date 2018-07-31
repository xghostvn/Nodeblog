var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var validator = require('express-validator');
var settings = require('./settings');
var {members} = require('../models/members');


var FacebookStrategy = require('passport-facebook').Strategy;

var cfgAuth = require('./auth');

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    members.findById(id, function (err, user) {
      done(err, user);
    });
  });


  //registry member
  passport.use('local.registry',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true,
    
  },(req,email,password,done)=>{
     
        req.checkBody('firstname','Please input your first name').notEmpty();
        req.checkBody('lastname','Please input your last name').notEmpty();
        req.checkBody('email','Email address invalid , please check again').notEmpty().isEmail();
        req.checkBody('password',`Password invalid . At least ${settings.passwordLenght} character`).notEmpty().isLength({min:settings.passwordLenght});
        req.checkBody('re-password','Confirm re-password is not the same , Please check again').equals(req.body.password);
        req.checkBody('accept','You have tp accept with our terms to continue').equals('1');

        var errors = req.validationErrors(); // express-validator helper


        if(errors){

            var messages = [];

            errors.forEach((error)=>{
                messages.push(error.msg);
            });
            return done(null,false,req.flash('error',messages));
        }

            console.log(email);
        members.findOne({'local.email':email}).then((result)=>{

            if(!result){
               return Promise.reject();
            }

            return done(null,false,req.flash('error','Email address already use'));

            
        }).catch((e)=>{


            var newMember = new members({

                info:{
                    firstname : req.body.firstname,
                    lastname : req.body.lastname,

                },
                local : {
                    email:email,
                    password:password
                },
                roles : "Member"

            });

            newMember.save().then((result)=>{
                if(!result){
                    return Promise.reject();
                }

                return done(null,newMember,req.flash('success',req.body.lastname));
            }).catch(()=>{
                    return done(null,false,req.flash('error','404'));
            });





        });



  
      
  }));

//login  member
  passport.use('local.login',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback :true,
        


  },(req,username,password,done)=>{

     
        members.checklogin(username,password).then((result)=>{
         
                if(!result){
                    return Promise.reject();
                }
                if(!result.roles==="Member"){
                    return Promise.reject();
                }
         
            return done(null,result);


        }).catch((e)=>{
         
                return done(null,false,req.flash('error','Incorrect email or password'));
        });
        


  }));




//passport facebook
  passport.use(new FacebookStrategy({

    'clientID' :'951482668367152',
    'clientSecret' : '03b8e45aee1431406d8be34e1e676538',
    'callbackURL' :'https://localhost:3000/member/facebook/callback',
    'profileFields' : ['id', 'displayName', 'photos', 'email'],
    passReqToCallback:true,
    


  },(accessToken, refreshToken, profile, cb,done)=>{

        members.findOne({'facebook.id':profile.id}).then((resolve)=>{

                if(resolve){

                    return done(null,resolve);

                }else {

                    members.findOne({'local.email':profile.email[0].value}).then((resolve)=>{

                        if(resolve){

                            members.findOneAndUpdate({'local.email':profile.email[0].value},{
                                $set :{
                                    'facebook.email':profile.email[0].value,
                                    'facebook.id' : profile.id,
                                    'facebook.token' : accessToken,


                                }
                            },{
                                new : true
                            }).then((result)=>{

                                 if(!result) return done(null,false);

                                 return done(null,result);

                            }).catch((err)=>{
                                return Promise.reject();
                            })

                        }else {


                                var newMember = new members();
                                newMember.save({
                                    'facebook.email':profile.email[0].value,
                                    'facebook.id' : profile.id,
                                    'facebook.token' : accessToken,
                                        

                                }).then((result)=>{

                                        if(!result) return Promise.reject();
                                        
                                        return done(null,result);

                                }).catch((err)=>{
                                    return Promise.reject();
                                })

                        }

                    }).catch((err)=>{
                            return Promise.reject();
                    });

                }


        }).catch((err)=>{
            return done(err);
        })
        
            

  }));


//passport login admin
  passport.use('local.admin',new LocalStrategy({

        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true,
        

  }, (req,username,password,done)=>{

            req.checkBody('email',"Please input email address").notEmpty(); // validator
            req.checkBody('password',"Please input password").notEmpty();
            req.checkBody('pin_code',"Please input pin").notEmpty();


            var errors =  req.validationErrors();  // express-validator-helper


            if(errors){

                var messages = [];

                errors.forEach((error)=>{
                    messages.push(error.msg);
                });

                return done(null,false,req.flash('errors',messages));

            }


            members.checklogin(username,password,req.body.pin_code).then((result)=>{
                        console.log(result);
                    if(!result){
                        return done(null,false,req.flash('errors',"Invalid email address or password"));
                    }

                    if(!result.roles==="ADMIN"){
                        return done(null,false,req.flash('errors',"You don't have permission"));
                    }



                    return done(null,result);
                   



                 




            }).catch((err)=>{
                return done(null,false,req.flash('errors',err));
            })



    }


  ));