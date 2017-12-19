const mongoose=require('mongoose');
exports.Comment=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types
    },
    content:String,
    postId:{
        type:mongoose.Schema.Types
    },
    create_time:{
        type:String,
        default:(new Date()).toLocaleDateString()+'  '+(new Date()).toLocaleTimeString()
    }
});