const Product=require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const User =require('../models/userModel')
//add new product
const createProduct = asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct= await Product.create(req.body);
        
    res.json(newProduct);
    }
    catch(err){
        throw new Error(err);
    }
});

//get a product
const getaProduct = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        
        const findProduct = await Product.findById(id);
        res.json(findProduct);

    }catch(err){
        throw new Error(err)
    }
});

//get all products

const getAllProducts=asyncHandler(async(req,res)=>{
    try{
    const queryObj={...req.query};
    const excludeFields=['page','sort','limit','fields'];
    excludeFields.forEach((el)=> delete queryObj[el]);

    // let queryStr=JSON.stringify(queryObj);
    // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => '$${match}');
    //const query=Product.find(JSON.parse(queryStr));
    var query=Product.find(queryObj);

    //sorting
    if(req.query.sort){
        const sortBy=req.query.sort.split(",").join(" ");
        query=query.sort(sortBy);
    }else{
        query=query.sort('-createdAt');

    }

    //limiting fields
    if(req.query.fields){
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);

    }else{
       query=query.select("-__v"); 

    }
    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page-1)*limit;
    query=query.skip(skip).limit(limit);
    if(req.query.page){
        const productCount= await Product.countDocuments();
        if(skip >= productCount){
            throw new Error('this page does not exis');
        }
    }


    console.log(page,limit,skip);

    const products= await query;
    console.log(queryObj,excludeFields);
    
    res.json(products);
    }catch(err){
        throw new Error(err);
    }
});

// update product
const updateProduct=asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(updatedProduct);

    }catch(err){
        throw new Error(err);
    }
});

// delete product
const deleteProduct=asyncHandler(async(req,res)=>{
    try{
        
        const deleteProduct=await Product.findByIdAndDelete(req.params.id);
        if(deleteProduct){
            res.json({deleted:deleteProduct});
        }else{
            res.json({message:"not found this product"});
        }
        

    }catch(err){
        throw new Error(err);
    }
});

const addToWishlist=asyncHandler(async(req,res)=>{
 const {_id}=req.user;
 const {prodId} = req.body;
    try{
        const user=await User.findById(_id);
        const alreadyadded = user.wishlist.find((id)=>id.toString() ===prodId);
        console.log(alreadyadded)
        if(alreadyadded){
            let user = await User.findByIdAndUpdate(_id,{
                $pull:{wishlist: prodId}
            },{new:true});
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(_id,{
                $push:{wishlist: prodId}
            },{new:true});
            res.json(user);
        }
    }
    catch(err){
        throw new Error(err);
    }
})

const rating= asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    const {star,prodId,comment}=req.body;
    
    try{    
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
        (userId)=>userId.postedby.toString() === _id.toString()
        );
    if(alreadyRated){
        const updateRating = await Product.updateOne(
           { ratings:{$elemMatch:alreadyRated}},
            {$set:{"ratings.$.star":star,"ratings.$.comment":comment} },
            {new: true},
        );
        

    }else{
        const rateProduct = await Product.findByIdAndUpdate(prodId,{
            $push:{
                ratings:{
                    star:star,
                    comment:comment,
                    postedby:_id
                }

            }
        },{new:true});
        
    }
    const getallratings = await Product.findById(prodId);
    let totalRating=getallratings.ratings.length;
    let ratingsum=getallratings.ratings
    .map((item)=>item.star)
    .reduce((prev,curr) => prev+curr,0);
    let actualRating=Math.round(ratingsum/totalRating);
    let finalproduct=await Product.findByIdAndUpdate(prodId, {totalrating:actualRating,},{new:true});
    res.json(finalproduct);
    }catch(err){
        throw new Error(err);
    }
})



module.exports={
    createProduct,getaProduct,getAllProducts,updateProduct,deleteProduct,addToWishlist,rating
};