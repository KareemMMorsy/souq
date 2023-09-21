const Product=require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

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







module.exports={
    createProduct,getaProduct,getAllProducts,updateProduct,deleteProduct
};