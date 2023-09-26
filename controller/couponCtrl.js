const Coupon=require('../models/couponModel');
const validateMongoDbId=require('../utils/validateMongodbid');
const asyncHandler=require('express-async-handler');

//create coupon
const createCoupon = asyncHandler(async(req,res) =>{
    try{
        const newCoupon=await Coupon.create(req.body);
        res.json(newCoupon);

    }catch(err){
        throw new Error(err);
    }
});


const getAllCoupons = asyncHandler(async(req,res) =>{
    try{
        
        const coupons=await Coupon.find();
        res.json(coupons);

    }catch(err){
        throw new Error(err);
    }
});


const updateCoupon = asyncHandler(async(req,res) =>{
    try{
        const {id}=req.params;
        validateMongoDbId(id);
        const updatedCoupon=await Coupon.findByIdAndUpdate(id,req.body,{new:true});

        res.json(updatedCoupon);

    }catch(err){
        throw new Error(err);
    }
});


const deleteCoupon = asyncHandler(async(req,res) =>{
    try{
        const {id}=req.params;
        validateMongoDbId(id);
        const deletedCoupon=await Coupon.findByIdAndDelete(id);

        res.json(deletedCoupon);

    }catch(err){
        throw new Error(err);
    }
});

module.exports={createCoupon,getAllCoupons,updateCoupon,deleteCoupon};