const express= require('express');
const router= express.Router();


router.all('/*',(req,res,next)=> {
    req.app.locals.layout= 'admin';
    next();
})

router.get('/',(req,res)=> {
    res.render('routes_UI/admin/index',{title:'Index'});
})

//router.get('/dashboard',(req,res)=> {
//    res.render('routes_UI/admin/dashboard', {title:'Dashboard'});
//})


module.exports= router;