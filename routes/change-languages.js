var express = require('express');
var router = express.Router();


router.get('/:languages',(req,res,next)=>{

    res.cookie('languages',req.params.languages,{maxAge:900000});
    console.log(req.params.languages);
    
    res.redirect('back');
 
});
module.exports = router;
