const mongoose=require('mongoose');
const CommentSchema=require('../schemas/comments').Comment;
exports.Comment=mongoose.model('Comment',CommentSchema);