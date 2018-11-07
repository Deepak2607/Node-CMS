const express= require('express');
const router= express.Router();
const {Post}= require('../../models/Post');


router.all('/*',(req,res,next)=> {
    req.app.locals.layout= 'home';
    next();
})


router.get('/',(req,res)=> {
    
    Post.find().then((posts)=> {
        res.render('routes_UI/home/index',{posts});
    })
    
    
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

router.get('/post/:id',(req,res)=> {
    
    Post.findById(req.params.id).then((post)=> {
        res.render('routes_UI/home/post',{post});
    })
})





module.exports= router;