const mongoose=require('mongoose');
const UserSchema=require('../schemas/user').User;
exports.User=mongoose.model('User',UserSchema);