const express=require("express");
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router =express.Router();
//get all coupons
router.get("/",getAllCoupons);

//update coupon
router.put("/:id",authMiddleware,isAdmin,updateCoupon);

//delete coupon
router.delete("/:id",authMiddleware,isAdmin,deleteCoupon);


//create new coupon
router.post("/",authMiddleware,isAdmin,createCoupon);

module.exports=router;