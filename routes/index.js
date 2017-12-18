const PostModel=require('../models/post').Post;

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


module.exports={
  home
}