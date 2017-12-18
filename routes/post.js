const PostModel=require('../models/post').Post;
const CommentModel=require('../models/comment').Comment;

const getCreate=async (ctx,next)=>{
    const user=ctx.session.user;
    await ctx.render('create',{
        title:"新建文章",
        user:user
    })
};

const postCreate=async (ctx,next)=>{
    const postData=ctx.request.body;
    const title=postData.title;
    const content=postData.content;
    const author=ctx.session.user.name;

    try{
        if(!title){
            throw new Error('标题不能为空');
        }
        if(!content){
            throw new Error('内容不能为空');
        }
    }catch(e){
        return ctx.body={
            status:0,
            data:e.message
        }
    }

    const post=new PostModel({
        author:author,
        title:title,
        content:content,
        pv:0
    });
    const postRes=await post.save();
    try{
        if(postRes){
            return ctx.body={
                status:2,
                data:'发表成功',
                id:postRes._id
            }
        }
        return ctx.body={
            status:1,
            data:'发表失败'
        }
    }catch(e){
        return ctx.body={
            status:4,
            data:'发表失败'
        }
    }

};

const getPost=async (ctx,next)=>{
    const postId=ctx.params.postId;
    const user=ctx.session.user;
    var name;
    if(user){
        name=user
    }else{
        name=' '
    }
    // var content=await PostModel.update({_id:postId},{$inc:{pv:1}}).findOne({_id:postId});
    var content=await Promise.all([PostModel.update({_id:postId},{$inc:{pv:1}}),PostModel.findOne({_id:postId})]);
    await ctx.render('post',{
        title:'查看内容',
        name:name,
        user:user,
        content:content[1]
    })
}

const getComment=async (ctx,nex)=>{
    var id=ctx.request.body.postId;

    var getComments=await CommentModel.find({postId:id}).sort({_id:-1});
    try{
        return ctx.body={
            status:1,
            data:getComments
        }
    }catch(e){
        return ctx.body={
            status:0,
            data:'获取评论失败'
        }
    }
    

}

const delPost=async (ctx,next)=>{
    var id=ctx.request.body.id;
    console.log(id)
    var delRes=await PostModel.remove({_id:id});
    if(delRes){
        return ctx.body={
            status:1,
            data:"删除成功"
        }
    }else{
        return ctx.body={
            status:0,
            data:"删除失败"
        }
    }
}

const newComment=async (ctx,next)=>{
    const content=ctx.request.body.content;
    const author=ctx.session.user.name;
    const postId=ctx.params.postId;

    const comment=new CommentModel({
        author:author,
        content:content,
        postId:postId
    })

    const contentSave=await comment.save();

    if(contentSave){
        return ctx.body={
            status:1,
            data:"评论成功"
        }
    }else{
        return ctx.body={
            status:0,
            data:"评论失败"
        }
    }
}


module.exports={
    getCreate,
    postCreate,
    getPost,
    delPost,
    newComment,
    getComment
}