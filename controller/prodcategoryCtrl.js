const Category=require('../models/prodcategoryModel');
const asyncHandler=require('express-async-handler');
const validateMongoDbId =require('../utils/validateMongodbid');

const createCategory=asyncHandler(async(req,res)=>{
    try{
        const newCategory= await Category.create(req.body);
        res.json(newCategory);
    }catch(err){
        throw new Error(err);
    }
});

const updateCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;

    try{
        validateMongoDbId(id);
        const updatedCategory= await Category.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedCategory);
    }catch(err){
        throw new Error(err);
    }
});

const deleteCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;

    try{
        validateMongoDbId(id);
        const deleteCategory= await Category.findByIdAndDelete(id);
        res.json(deleteCategory);
    }catch(err){
        throw new Error(err);
    }
});

const getCategory = asyncHandler(async(req,res)=>{
    const {id}=req.params;

    try{
        validateMongoDbId(id);
        const getCategory= await Category.findById(id);
        res.json(getCategory);
    }catch(err){
        throw new Error(err);
    }
});

const getAllCategory = asyncHandler(async(req,res)=>{
    try{
        const getCategories= await Category.find();
        res.json(getCategories);
    }catch(err){
        throw new Error(err);
    }
})

module.exports={createCategory,updateCategory,deleteCategory,getCategory,getAllCategory};