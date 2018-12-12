const express= require('express');
const router= express.Router();
const {Post}= require('../../models/Post');
const {Category}= require('../../models/Category');
const {User}= require('../../models/User');
const bcrypt = require('bcryptjs');


router.all('/*',(req,res,next)=> {
    req.app.locals.layout= 'home';
    next();
})


router.get('/',(req,res)=> {
    
    Post.find().then((posts)=> {
        
        Category.find().then((categories)=> {
            res.render('routes_UI/home/index',{posts, categories});
        })
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
        
        Category.find().then((categories)=> {
            res.render('routes_UI/home/post',{post, categories});
        })
    })
})



router.post('/register',(req,res)=> {
    
    let errors=[];
    
    if(!req.body.firstName){
        errors.push({message:'Enter first name'});
    }
    if(!req.body.lastName){
        errors.push({message:'Enter last name'});
    }
    if(!req.body.email){
        errors.push({message:'Enter email'});
    }
    if(!req.body.password){
        errors.push({message:'Enter password'});
    }
    if(req.body.password!==req.body.passwordConfirm){
        errors.push({message:'Passwords do not match'});
    }
    
    
    if(errors.length>0){
        res.render('routes_UI/home/register',{errors});
    }else{
        
        User.findOne({ email: req.body.email}).then((user)=> {
            if(user){
               req.flash('success_message',`A user with this email already exists`);
               res.redirect('/register');
            }else{
                    bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {

                        const user= new User({
                                firstName:req.body.firstName,
                                lastName:req.body.lastName,
                                email:req.body.email,
                                password:hash,
                            });

                        user.save().then(()=> {
                            req.flash('success_message',`You have registered successfully, please login`);
                            res.redirect('/login');
                        });
                     });
                  });
            }
        })   
    }   
})



router.post('/login',(req,res)=> {
    
    User.findOne({email:req.body.email}).then((user)=> {
        
        if(user){
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if(result){
                        req.flash('success_message',`Login successful`);
                        res.redirect('/');
                    }
                    else{
                        req.flash('success_message',`Password is incorrect`);
                        res.redirect('/login');
                    }
            });
        }
        else{
            req.flash('success_message',`Email not exists`);
            res.redirect('/login');
        }
        
})
})



module.exports= router;