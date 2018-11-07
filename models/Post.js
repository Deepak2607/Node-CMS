const mongoose= require('mongoose');

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
        type:String
    }
})
const Post= mongoose.model('posts', PostSchema);

module.exports={Post};