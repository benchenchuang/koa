const mongoose=require('mongoose');
exports.Banner=new mongoose.Schema({
    title:String,
    url:String,
    file:String
});