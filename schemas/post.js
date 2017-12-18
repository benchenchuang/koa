const mongoose=require('mongoose');
exports.Post=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types
    },
    title:String,
    content:String,
    create_time:{
        type:String,
        default:(new Date()).toLocaleDateString()+'  '+(new Date()).toLocaleTimeString()
    },
    pv:Number
})