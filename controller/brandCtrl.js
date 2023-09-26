const Brand=require('../models/brandModel');
const asyncHandler=require('express-async-handler');
const validateMongoDbId =require('../utils/validateMongodbid');

const createBrand=asyncHandler(async(req,res)=>{
    try{
        const newBrand= await Brand.create(req.body);
        res.json(newBrand);
    }catch(err){
        throw new Error(err);
    }
});

const updateBrand=asyncHandler(async(req,res)=>{
    const {id}=req.params;

    try{
        validateMongoDbId(id);
        const updatedBrand= await Brand.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedBrand);
    }catch(err){
        throw new Error(err);
    }
});

const deleteBrand=asyncHandler(async(req,res)=>{
    const {id}=req.params;

    try{
        validateMongoDbId(id);
        const deleteBrand= await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);
    }catch(err){
        throw new Error(err);
    }
});

const getBrand = asyncHandler(async(req,res)=>{
    const {id}=req.params;

    try{
        validateMongoDbId(id);
        const getBrand= await Brand.findById(id);
        res.json(getBrand);
    }catch(err){
        throw new Error(err);
    }
});

const getAllBrand = asyncHandler(async(req,res)=>{
    try{
        const getCategories= await Brand.find();
        res.json(getCategories);
    }catch(err){
        throw new Error(err);
    }
})

module.exports={createBrand,updateBrand,deleteBrand,getBrand,getAllBrand};