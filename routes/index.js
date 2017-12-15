
// 首页
const home= async (ctx, next) => {
  var user=ctx.session.user;
  await ctx.render('index', {
    title: 'koa 首页',
    user:user
  })
};


module.exports={
  home
}