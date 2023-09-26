const express=require('express');
const router=express.Router();
const {createBrand, updateBrand, deleteBrand, getBrand, getAllBrand}=require('../controller/brandCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

router.get("/:id",getBrand);

router.post("/",authMiddleware,isAdmin,createBrand);
router.put("/:id",authMiddleware,isAdmin,updateBrand);
router.delete("/:id",authMiddleware,isAdmin,deleteBrand);
router.get("/",getAllBrand)
module.exports=router;