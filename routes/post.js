const getPost=async (ctx,next)=>{
    var user=ctx.session.user;
    await ctx.render('post',{
        title:"新建文章",
        user:user
    })
};

const postPost=async (ctx,next)=>{
    var postData=ctx.request.body;
    var title=postData.title;
    var content=postData.content;
    console.log(ctx.request.body)
};


module.exports={
    getPost,
    postPost
}