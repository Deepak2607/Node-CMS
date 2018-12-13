const express= require('express');
const router= express.Router();
const moment= require('moment');
const {Category}= require('../../models/Category');

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


router.get('/',isAuthenticated,(req,res)=> {
    
    Category.find().then((categories)=> {
        res.render('routes_UI/admin/categories/index',{categories, user:req.user});
    })
})


router.get('/edit/:id',isAuthenticated,(req,res)=> {
    
    Category.findById(req.params.id).then((category)=> {
         res.render('routes_UI/admin/categories/edit',{category, user:req.user});
    })
})



router.post('/create',isAuthenticated,(req,res)=> {
    
    const category= new Category({
        name:req.body.name,
        date:moment().format('MMMM Do YYYY, h:mm:ss a'),
    })
    
    category.save().then(()=> {
        res.redirect('/admin/categories');
    })
})


router.put('/edit/:id',isAuthenticated,(req,res)=> {
    
   Category.findById(req.params.id).then((category)=> {
       category.name= req.body.name;
       
       category.save().then(()=> {
           res.redirect('/admin/categories');
       })
   })   
})


router.delete('/:id',isAuthenticated,(req,res)=> {
    
    Category.findById(req.params.id).then((category)=> {
        
        category.remove();
        res.redirect('/admin/categories');     
    })
})






module.exports= router;