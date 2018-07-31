module.exports.index = (req,res,next)=>{

    var mess = req.flash('success');
    res.render('index',{title:'Exp',lastname:mess});
};

module.exports.regisger = (req,res,next)=>{


    res.render('member');
}