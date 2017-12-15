const router = require('koa-router')();
const checkLogin=require('../middle/index').checkLogin;
const checkNotLogin=require('../middle/index').checkNotLogin;
// 注册登录模块
const signRouters=require('./sign');
//首页模块
const homeRouters=require('./index');
//文章模块
const postRouters=require('./post');

// 首頁
router.get('/',homeRouters.home);
// 登錄验证码
router.get('/code',signRouters.code);
//登录
router.get('/login',checkLogin,signRouters.getLogin);
router.post('/login',signRouters.postLogin);
//注册
router.get('/sign',checkLogin,signRouters.getSign);
router.post('/sign',signRouters.postSign);
//退出登录
router.get('/signout',signRouters.signOut);
//新建文章
router.get('/post',checkLogin,postRouters.getPost);
router.post('/post',postRouters.postPost);



router.get('*',async (ctx,next)=>{
    await ctx.render('error',{
        title:'404'
    })
})

module.exports = router
