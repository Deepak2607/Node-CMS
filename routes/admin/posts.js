const express= require('express');
const router= express.Router();
const {Post}= require('../../models/Post');
const fs= require('fs');
const path= require('path');
const flash= require('connect-flash');
const moment= require('moment');

const uploadDir= path.join(__dirname, '../../public/uploads/');
      
router.all('/*',(req,res,next)=> {
    req.app.locals.layout= 'admin';
    next();
})


router.get('/',(req,res)=> {
    res.send('it works');
})


router.get('/create',(req,res)=> {
    res.render('routes_UI/admin/posts/create');
})


router.get('/all_posts',(req,res)=> {
    
    Post.find().then((posts)=> {
        res.render('routes_UI/admin/posts/all_posts' ,{posts});
    },(e)=> {
        res.send(e);
    })
})


router.get('/edit/:id',(req,res)=> {
    
    Post.findById(req.params.id).then((post)=> {
        res.render('routes_UI/admin/posts/edit',{
            id:req.params.id,
            title:post.title,
            description:post.description,
            status:post.status,
            allowComments:post.allowComments,
            file:post.file
        });
    })
})


router.post('/create',(req,res)=> {
      
    const file= req.files.file;
    const filename= Date.now()+'-'+file.name;
    console.log(file);
    
    file.mv('./public/uploads/'+ filename, (err)=> {
        if(err){
            throw err;}
    });
    
    
    let allowComments;
    if(req.body.allowComments){
        allowComments=true;}
    else{
        allowComments=false;}
    
    const post= new Post({
        title:req.body.title,
        status:req.body.status,
        description:req.body.description,
        allowComments:allowComments,
        file:filename,
        date:moment().format('MMMM Do YYYY, h:mm:ss a')
    })
         
    post.save().then(()=> {
        
        req.flash('success_message',`Post ${post.title} created successfully`);
        res.redirect('/admin/posts/all_posts');
    },(e)=> {
        res.send(e);
    })
})



router.put('/edit/:id',(req,res)=> {
    
    const file= req.files.file;
    const filename= Date.now()+'-'+file.name;
    console.log(filename);
    
    file.mv('./public/uploads/'+ filename, (err)=> {
        if(err){
            throw err;}
    });
    
    let allowComments;
    if(req.body.allowComments){
        allowComments=true;}
    else{
        allowComments=false;}
    
     Post.findById(req.params.id).then((post)=> {
        
         post.title= req.body.title;
         post.status= req.body.status;
         post.description= req.body.description;
         post.allowComments= allowComments;
         post.file= filename;
     
         
         post.save().then(()=>{
             req.flash('success_message',`Post ${post.title} updated successfully`);
             res.redirect('/admin/posts/all_posts');
         })
             
    })
    
})



router.delete('/:id',(req,res)=> {
    
    Post.findById(req.params.id).then((post)=> {
        
        post.remove();
     
        fs.unlink(uploadDir+ post.file, (err) => {
          if (err) throw err;
        });
        
        req.flash('success_message',`Post ${post.title} deleted successfully`);
        res.redirect('/admin/posts/all_posts');
    })
})
















module.exports= router;