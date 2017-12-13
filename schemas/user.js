const mongoose=require('mongoose');
exports.User=new mongoose.Schema({
    name:String,
    password:String,
    token:String,
    create_time:{
        type:String,
        default:(new Date()).toLocaleDateString()+'  '+(new Date()).toLocaleTimeString()
    }
})