const router = require('koa-router')();
const md5=require('md5');
const jwt=require('jsonwebtoken');
const secret=Date.now().toString();
const UserModel=require('../models/user').User;
const checkLogin=require('../middle/index').checkLogin;
const checkNotLogin=require('../middle/index').checkNotLogin;
const captchapng=require('captchapng');

//生成数字验证码
router.get('/code',(ctx,next)=>{
  var str=parseInt(Math.random()*9000+1000);
  ctx.session.code=str;
  var p = new captchapng(80, 30, str); //生成图片
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);
  var img = p.getBase64();
  var imgbase64 = new Buffer(img, 'base64');
  ctx.response.type="image/png";
  ctx.body=imgbase64;
});

// 首页
router.get('/', async (ctx, next) => {
        await ctx.render('index', {
          title: 'koa 首页'
        })
      })

router.get('/login', checkLogin,async (ctx, next) => {
    await ctx.render('login', {
      title: 'koa 登录'
      });
    })
    .post('/login',async (ctx,next)=>{
        var formData=ctx.request.body;
        var username=formData.username;
        var password=formData.password;
        var code=formData.code;
        var thisCode=ctx.session.code;

        try{
          if(!username){
            throw new Error('用户名不能为空')
          }
          if(!password){
            throw new Error('密码不能为空')
          }
          if(code!=thisCode){
            throw new Error('验证码不正确')
          }
        }catch(e){
          return ctx.body={
            status:0,
            data:e.message
          }
        }
        const token=jwt.sign({
          name:username
        },secret,{
          expiresIn:600
        });
        
        await UserModel.findOne({
          name:username
        }).then(res=>{
          if(!res){
            return ctx.body={
              status:1,
              data:'用户名未注册'
            }
          }else{
            if(res.password==md5(password)){
              return UserModel.update({_id:res.id},{$set:{token:token}}).then(res=>{
                if(res){
                  res.password='';
                  ctx.session.user=res;
                  ctx.session.token=token;
                  return ctx.body={
                    status:2,
                    data:'登陆成功'
                  }
                }else{
                  return ctx.body={
                    status:5,
                    data:'登陆失败'
                  }
                }
              })
            }else{
              return ctx.body={
                status:3,
                data:'用户名或密码不正确'
              }
            }
          }
        }).catch(()=>{
          return ctx.body={
            status:4,
            data:'登录失败'
          }
        })

    });

router.get('/sign',async (ctx, next) => {
      await ctx.render('sign', {
          title: 'koa 注册'
        });
      })
      .post('/sign',async(ctx,next)=>{
        var formData=ctx.request.body;
        var username=formData.username;
        var password=formData.password;
        var repassword=formData.repassword;
        try{
          if(!username){
            throw new Error('用户名不能为空')
          }
          if(!password){
            throw new Error('密码不能为空')
          }
          if(password!=repassword){
            throw new Error('两次密码不一致')
          }
        }catch(e){
          return ctx.body={
            status:0,
            data:e.message
          }
        };

        password=md5(password);
        var UserForm=new UserModel({
          name:username,
          password:password,
          token:''
        });

        await UserModel.findOne({
          name:username
        }).then(res=>{
          if(res){
            return ctx.body={
              status:1,
              data:'用户名已存在'
            }
          }
          return UserForm.save().then(res=>{
            console.log(res)
            if(res){
              return ctx.body={
                status:2,
                data:'注册成功'
              }
            }
            return ctx.body={
              status:3,
              data:'注册失败'
            }
          })
        }).catch(()=>{
          return ctx.body={
            status:4,
            data:'注册失败'
          }
        })
    })

module.exports = router
