const UserModel=require('../models/user').User;
module.exports={
    checkLogin:async (ctx,next)=>{
        await next();
        if(ctx.session.token){
            return UserModel.findOne({
                token:ctx.session.token
            }).then(res=>{
                console.log('res: '+res)
                if(res){
                   ctx.redirect('/');
                }else{
                    ctx.session.token=''
                }
            })
        }
    },
    checkNotLogin:async (ctx,next)=>{
        await next();
        if(!ctx.session.token){
            return ctx.redirect('/login')
        }
        
    }
}