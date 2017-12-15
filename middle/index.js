const UserModel=require('../models/user').User;
module.exports={
    checkLogin:async (ctx,next)=>{
        try{
            if(ctx.session.token){
                // //禁止异地登录
                var findRes=await UserModel.findOne({token:ctx.session.token});
                if(findRes){
                    if(ctx.request.url=='/login'){
                        return ctx.redirect('/')
                    }
                 }else{
                     ctx.session.token=''
                     return ctx.redirect('/login');
                 }
            }
        }catch(e){
            return ctx.redirect('/login')
        }
        await next();
    },
    checkNotLogin:async (ctx,next)=>{
        
        if(!ctx.session.token){
            return ctx.redirect('/login')
        }
        await next();
    }
}