const express= require('express');
const router= express.Router();


router.all('/*',(req,res,next)=> {
    req.app.locals.layout= 'admin';
    next();
})

const isAuthenticated= (req,res,next)=> {
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('error',`You are not logged in.`);
        res.redirect('/login');
    }
}

router.get('/',isAuthenticated, (req,res)=> {
    res.render('routes_UI/admin/profile',{user:req.user});
})


module.exports= router;