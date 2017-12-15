const md5=require('md5');
const jwt=require('jsonwebtoken');
const secret=Date.now().toString();
const UserModel=require('../models/user').User;
const captchapng=require('captchapng');

//生成数字验证码
const code=(ctx,next)=>{
  var str=parseInt(Math.random()*9000+1000);
  ctx.session.code=str;
  var p = new captchapng(80, 30, str); //生成图片
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);
  var img = p.getBase64();
  var imgbase64 = new Buffer(img, 'base64');
  ctx.response.type="image/png";
  ctx.body=imgbase64;
};
const getLogin=async (ctx, next) => {
    await ctx.render('login', {
      title: 'koa 登录'
      });
    };
const postLogin=async (ctx,next)=>{
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
        
        var findRes=await UserModel.findOne({name:username});
        console.log('findres: '+findRes)
        try{
          if(findRes){
            // 判断密码
            if(findRes.password==md5(password)){
              var updateRes=await UserModel.update({_id:findRes.id},{$set:{token:token}});
              if(updateRes){
                findRes.password='';
                ctx.session.user=findRes;
                ctx.session.token=token;
                return ctx.body={
                  status:2,
                  data:'登陆成功'
                }
              }
              return ctx.body={
                status:5,
                data:'登陆失败'
              }
            
            }else{
              return ctx.body={
                status:3,
                data:'用户名或密码不正确'
              }
            }
          }
          return ctx.body={
            status:1,
            data:'用户名未注册'
          }
          
        }catch(e){
          return ctx.body={
            status:4,
            data:'登录失败'
          }
        }
    };

const getSign=async (ctx, next) => {
      await ctx.render('sign', {
          title: 'koa 注册'
        });
      };
const postSign=async(ctx,next)=>{
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

        var findRes=await UserModel.findOne({name:username});

        try{
          if(findRes){
            return ctx.body={
              status:1,
              data:'用户名已存在'
            }
          }
          var saveRes=await UserForm.save();
          if(saveRes){
            return ctx.body={
              status:2,
              data:'注册成功'
            }
          }else{
            return ctx.body={
              status:3,
              data:'注册失败'
            }
          }

        }catch(e){
          return ctx.body={
            status:4,
            data:'注册失败'
          }
        }
    };

const signOut=async (ctx,nex)=>{
    ctx.session.user="";
    ctx.session.token="";
    await ctx.redirect('/');
};

module.exports ={
    code:code,
    getLogin:getLogin,
    postLogin:postLogin,
    getSign:getSign,
    postSign:postSign,
    signOut
}
