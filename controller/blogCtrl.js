const Blog = require('../models/blogModel');
const User= require('../models/userModel');
const asyncHandler= require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');
const cloudinaryUploadImg=require('../utils/cloudinary');
const fs= require('fs');

//crete new blog
const createBlog=asyncHandler(async(req,res)=>{
    try{
        const newBlog=await Blog.create(req.body);
        res.json({
            status:"success",
            newBlog:newBlog
        })
    }catch(err){
        throw new Error(err);
    }
});

//update Blog
const updateBlog=asyncHandler(async(req,res)=>{
    try{
        const {id} =req.params;
        validateMongoDbId(id);
        const updateBlog=await Blog.findByIdAndUpdate(id,req.body,{new:true});
        res.json({
            status:"success",
            updateBlog:updateBlog
        })
    }catch(err){
        throw new Error(err);
    }
})

// get a blog
const getBlog=asyncHandler(async(req,res)=>{
    try{
        const {id} =req.params;
        validateMongoDbId(id);
        const getBlog=await Blog.findById(id);
        await Blog.findByIdAndUpdate(id,
            {
                $inc:{numViews:1}

        },{new:true})
        res.json(getBlog);
    }catch(err){
        throw new Error(err);
    }
});

//get all blogs
const getAllBlogs = asyncHandler(async(req,res)=>{
    try{
        const allBlogs=await Blog.find().populate('likes');
        res.json(allBlogs);
    }catch(err){
        throw new Error(err);
    }
});

//delete a blog
const deleteBlog = asyncHandler(async(req,res)=>{
    try{
        const {id} =req.params;
        validateMongoDbId(id);
        const deleteBlog=await Blog.findByIdAndDelete(id);
        res.json({
            status:"success",
            deleted:deleteBlog
        })
    }catch(err){
        throw new Error(err);
    }
})

//like a blog
const likeBlog=asyncHandler(async(req,res)=>{
    const {blogId}=req.body;
    validateMongoDbId(blogId);
    try{
    //find blog which you want to like
    const blog= await Blog.findById(blogId);

    //find the login usr
    const loginUsrId=req?.user?._id;

    //find if the use has iked the blog
    const isLiked= blog?.isLiked;

    //find if the user has disliked the blog
    const alreadyDisliked=blog?.dislikes?.find(
        ((userId)=>  userId?.toString()===loginUsrId?.toString())
    );
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUsrId},
            isDisliked:false
        },{new:true});
        res.json(blog)
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUsrId},
            isLiked:false
        },{new:true});
        res.json(blog)
    }
    else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push:{likes:loginUsrId},
            isLiked:true
        },{new:true});
        res.json(blog)
    }

    }catch(err){
        throw new Error(err);
    } 
});

//dislike a blog
const dislikeBlog=asyncHandler(async(req,res)=>{
    const {blogId}=req.body;
    validateMongoDbId(blogId);
    try{
    //find blog which you want to like
    const blog= await Blog.findById(blogId);

    //find the login usr
    const loginUsrId=req?.user?._id;

    //find if the use has iked the blog
    const isDisLiked= blog?.isDisliked;

    //find if the user has disliked the blog
    const alreadyLiked=blog?.likes?.find(
        ((userId)=>  userId?.toString()===loginUsrId?.toString())
    );
    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUsrId},
            isLiked:false
        },{new:true});
        res.json(blog)
    }
    if(isDisLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUsrId},
            isDisliked:false
        },{new:true});
        res.json(blog)
    }
    else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push:{dislikes:loginUsrId},
            isDisliked:true
        },{new:true});
        res.json(blog)
    }

    }catch(err){
        throw new Error(err);
    } 
});

const uploadImages = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    //validateMongoDbId()
    try{
        const uploader = (path) => cloudinaryUploadImg(path,"images");
        const urls = [];
        const files = req.files;
        for (const file of files){
            const {path}= file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(
            id
            ,{images:urls.map((file)=>{return file}),}
            ,{new:true});
        res.json(findBlog);
    }
    catch(err)
    {throw new Error(err)}
})

module.exports={createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog,likeBlog,dislikeBlog,uploadImages};
