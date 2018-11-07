const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const exphbs= require('express-handlebars');
const path= require('path');
const {select}= require('./helpers/handlebars-helpers');
const methodOverride= require('method-override');
const upload= require('express-fileupload');


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


//Load Routes
const home= require('./routes/home/index');
const admin= require('./routes/admin/index');
const posts= require('./routes/admin/posts');


//Use routes
app.use('/',home);
app.use('/admin',admin);
app.use('/admin/posts',posts);




app.listen(8000,()=> {
    console.log('Server started at port 8000');
})
