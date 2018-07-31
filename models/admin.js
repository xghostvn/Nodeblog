const mongoose = require('mongoose');


const admin =new  mongoose.Schema({

        info :{
            firstname : String,
            lastname  : String
        },
        local : {
            username : String,
            password : String
        }


});