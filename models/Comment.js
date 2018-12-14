const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema= new mongoose.Schema({
    
    commentedBy:{
        type: Object,
        required: true
    },
    comment:{
        type: String,
        required: true
    },
//    postId:{
//        type: String,
//        required: true
//    }
},{usePushEach: true})

const Comment= mongoose.model('comments', CommentSchema);

module.exports={Comment};