const express= require('express');
const mongoose= require('mongoose');
const upload= require('express-fileupload');
const bodyParser= require('body-parser');
const exphbs= require('express-handlebars');
const path= require('path');
const methodOverride= require('method-override');
const session= require('express-session');
const flash= require('connect-flash');
const {select}= require('./helpers/handlebars-helpers');

const app= express();

mongoose.connect('mongodb://localhost:27017/cms',{ useNewUrlParser: true });
app.use(express.static(path.join(__dirname, 'public')));

//upload-middleware
app.use(upload()); 


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//View engine-----defaultLayout:home
app.engine('handlebars', exphbs({ helpers:{select}}));
app.set('view engine', 'handlebars');


//method-override
app.use(methodOverride('_method'));


//session-middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'deepakkumrawat8@gmail.com',
  resave: true,
  saveUninitialized: true,
}))


//flash-middleware
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_message=req.flash('success_message');
    next();
});


//Load Routes
const home= require('./routes/home/index');
const admin= require('./routes/admin/index');
const posts= require('./routes/admin/posts');
const categories= require('./routes/admin/categories');

//Use routes
app.use('/',home);
app.use('/admin',admin);
app.use('/admin/posts',posts);
app.use('/admin/categories',categories);




app.listen(8000,()=> {
    console.log('Server started at port 8000');
})
