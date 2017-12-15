const mongoose=require('mongoose');
exports.Post=new mongoose.Schema({
    title:String,
    content:String,
    create_time:{
        type:String,
        default:(new Date()).toLocaleDateString()+'  '+(new Date()).toLocaleTimeString()
    },
    update_time:{
        type:String,
        default:''
    }
})