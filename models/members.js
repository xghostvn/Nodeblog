const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const MemberSchema = new mongoose.Schema({

    info : {
        firstname : String,
        lastname : String,
        phone : String,
        company : String,
        address : String,
        cities : [
            {
                type : mongoose.Schema.ObjectId,
                ref :'City'
            }
        ]
    },
    local : {
        email : String,
        password : String,
        pin_code : String
    },
    facebook : {
        id : String,
        token : String,
        email : String,
        name : String,
        photo :String
    },
    google : {
        id : String,
        token : String,
        email : String,
        name : String,
        photo :String
    },
    newsletter : Boolean,
    roles : String,
    status : String

});




MemberSchema.pre('save',function(next){

        var member = this;

        if(member.isModified('local.password')){

            bcrypt.genSalt(10,(err,salt)=>{

                bcrypt.hash(member.local.password,salt,(err,result)=>{
                    member.local.password=result;

                    next();
                });

            });

        }else {
            next();
        }


});


MemberSchema.statics.checklogin = function(email,password,pin_code){

    var member = this;

   return member.findOne({'local.email' : email}).then((result)=>{

        if(!result) {
            return Promise.reject();
        }

        if(pin_code){

            if(!bcrypt.compareSync(pin_code,result.local.pin_code)){
                return Promise.reject();
            }

        }

        return new Promise((resolve,reject)=>{

                

            bcrypt.compare(password,result.local.password,(err,res)=>{
                if(!res){
               
                    reject(res);
                }else {
                    console.log(result);
                    resolve(result);
                }
                



            });

        });




    }).catch((e)=>{
            return Promise.reject();
    });

};





var members = mongoose.model('members',MemberSchema);

module.exports = {members};