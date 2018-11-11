const express= require('express');
const router= express.Router();
const moment= require('moment');
const {Category}= require('../../models/Category');

router.all('/*',(req,res,next)=> {
    req.app.locals.layout= 'admin';
    next();
})

router.get('/',(req,res)=> {
    
    Category.find().then((categories)=> {
        res.render('routes_UI/admin/categories/index',{categories});
    })
})


router.get('/edit/:id',(req,res)=> {
    
    Category.findById(req.params.id).then((category)=> {
         res.render('routes_UI/admin/categories/edit',{category});
    })
})



router.post('/create',(req,res)=> {
    
    const category= new Category({
        name:req.body.name,
        date:moment().format('MMMM Do YYYY, h:mm:ss a'),
    })
    
    category.save().then(()=> {
        res.redirect('/admin/categories');
    })
})


router.put('/edit/:id',(req,res)=> {
    
   Category.findById(req.params.id).then((category)=> {
       category.name= req.body.name;
       
       category.save().then(()=> {
           res.redirect('/admin/categories');
       })
   })   
})


router.delete('/:id',(req,res)=> {
    
    Category.findById(req.params.id).then((category)=> {
        
        category.remove();
        res.redirect('/admin/categories');     
    })
})






module.exports= router;