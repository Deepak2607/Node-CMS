const express= require('express');
const router= express.Router();


router.all('/*',(req,res,next)=> {
    req.app.locals.layout= 'home';
    next();
})


router.get('/',(req,res)=> {
    res.render('routes_UI/home/index');
})

router.get('/about',(req,res)=> {
    res.render('routes_UI/home/about');
})

router.get('/login',(req,res)=> {
    res.render('routes_UI/home/login');
})

router.get('/register',(req,res)=> {
    res.render('routes_UI/home/register');
})

module.exports= router;