const PostModel=require('../models/post').Post;
const BannerModel=require('../models/banner').Banner;


const fileBanner= async (ctx,next)=>{
  const filename=ctx.req.file.filename;
  ctx.session.filename=filename;
  return ctx.body={
    status:1,
    data:"上传成功"
  }
}

// 首页
const home= async (ctx, next) => {
  const limit=parseInt(ctx.query.limit) || 4;
  const page=parseInt(ctx.query.page) || 1;
  const skip=(page-1)*limit;
  const total=await PostModel.find({}).count();
  const allPages=Math.ceil(total/limit);

  var user=ctx.session.user;
  var content=await PostModel.find({}).skip(skip).limit(limit).sort({_id:-1});
  await ctx.render('index', {
    title: 'koa 首页',
    user:user,
    postContent:content,
    totalPages:allPages,
    page:page,
    minPage:page-1<=0,
    maxPage:page>=allPages
  })
};

const adminBanner=async (ctx,next)=>{
    await ctx.render('banner',{
      title:"后台管理-banner",
      user:ctx.session.user
    })
}
const postBanner=async (ctx,next)=>{
  var banner=ctx.session.filename;
  var bannerData=ctx.request.body;
  var banner_title=bannerData.title;
  var banner_url=bannerData.url;
  
  var newBanner =new BannerModel({
    title:banner_title,
    url:banner_url,
    file:banner
  });
  var saveRes=await newBanner.save();
  try{
    if(saveRes){
      return ctx.body={
        status:1,
        data:'上传成功'
      }
    }
    return ctx.body={
      status:0,
      data:'上传失败'
    }
  }catch(e){
    return ctx.body={
      status:0,
      data:'上传失败'
    }
  }

}

const getBanner=async (ctx,next)=>{
  await ctx.render('banner_list',{
    title:"后台管理-banner",
    user:ctx.session.user
  });
}
const get_banner_list=async (ctx,next)=>{
  var bannerData=await BannerModel.find({});
  try{
    if(bannerData){
      return ctx.body={
        status:1,
        data:bannerData
      }
    }
    return ctx.body={
      status:0,
      data:'暂无数据'
    }
  }catch(e){
    return ctx.body={
      status:2,
      data:'错误'
    }
  }
  
}

const del_banner=async (ctx,next)=>{
  const id=ctx.request.body.id;
  const delRes=await BannerModel.remove({_id:id});
  try{
    if(delRes){
      return ctx.body={
        status:1,
        data:"删除成功"
      }
    }
  }catch(e){
    return ctx.body={
      status:0,
      data:"发生错误"
    }
  }
}

module.exports={
  home,
  adminBanner,
  postBanner,
  fileBanner,
  getBanner,
  get_banner_list,
  del_banner
}