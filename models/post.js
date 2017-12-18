const mongoose=require('mongoose');
const PostSchema=require('../schemas/post').Post;
exports.Post=mongoose.model('Post',PostSchema);