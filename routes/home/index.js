const express= require('express');
const router= express.Router();
const {Post}= require('../../models/Post');
const {Category}= require('../../models/Category');
const {User}= require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.all('/*',(req,res,next)=> {
    req.app.locals.layout= 'home';
    next();
})

const isNotAuthenticated= (req,res,next)=> {
    if(! req.isAuthenticated()){
        next();
    }else{
        req.flash('error',`You need to logout first.`);
        res.redirect('/admin');
    }
}

router.get('/',(req,res)=> {
    
    Post.find().then((posts)=> {
        
        Category.find().then((categories)=> {
            res.render('routes_UI/home/all_posts',{posts, categories, user:req.user});
        })
    })   
})

router.get('/about',(req,res)=> {
    res.render('routes_UI/home/about',{user:req.user});
})


router.get('/post/:id',(req,res)=> {
    
    Post.findById(req.params.id).then((post)=> {
        
        Category.find().then((categories)=> {
            console.log(req.user);
            res.render('routes_UI/home/post',{post, categories, user:req.user});
        })
    })
})


router.get('/login',isNotAuthenticated, (req,res)=> {

    res.render('routes_UI/home/login');
})

router.get('/register',isNotAuthenticated, (req,res)=> {
    res.render('routes_UI/home/register');
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


passport.use(new LocalStrategy({usernameField: 'email'},
  (email, password, done)=> {
    
    User.findOne({email:email}).then((user)=> {
        
      if (!user) {
        return done(null, false);
      }
        
        bcrypt.compare(password, user.password,(err, matched)=> {
            
                if(matched){
                    return done(null, user);
                }
                else{
                    return done(null, false);
                }
        });
    })
   }
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



router.post('/login',
  passport.authenticate('local'
                        , {successRedirect: '/admin',
                          failureRedirect: '/login',
                          failureFlash: 'Invalid username or password.',
                          successFlash: 'Welcome!'}
                       ));



router.get('/logout',(req, res)=>{
  req.logout();
  res.redirect('/login');
});



module.exports= router;



//router.post('/login',(req,res)=> {
//    
//    User.findOne({email:req.body.email}).then((user)=> {
//        
//        if(user){
//            bcrypt.compare(req.body.password, user.password, function(err, result) {
//                    if(result){
//                        req.flash('success_message',`Login successful`);
//                        res.redirect('/admin');
//                    }
//                    else{
//                        req.flash('success_message',`Password is incorrect`);
//                        res.redirect('/login');
//                    }
//            });
//        }
//        else{
//            req.flash('success_message',`Email not exists`);
//            res.redirect('/login');
//        }
//        
//})
//})
