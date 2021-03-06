const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const PostSchema= new mongoose.Schema({
    
    title:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default:'public'
    },
    description:{
        type: String,
        required: true
    },
    allowComments:{
        type: Boolean,
        required: true,
    },
    file:{
        type: String,
        required: true,
    },
    date:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required:true
    },
   postedBy:{
        type: Object,
        required: true
    },
    comments:[{
        type: Object,
        required: true
    }]
}, {usePushEach: true})
const Post= mongoose.model('posts', PostSchema);

module.exports={Post};