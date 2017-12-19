const mongoose=require('mongoose');
const BannerSchema=require('../schemas/banner').Banner;
exports.Banner=mongoose.model('Banner',BannerSchema);