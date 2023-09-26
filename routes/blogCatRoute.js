const express=require('express');
const router=express.Router();
const {createCategory, updateCategory, deleteCategory, getCategory, getAllCategory}=require('../controller/blogCatCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

router.get("/:id",getCategory);

router.post("/",authMiddleware,isAdmin,createCategory);
router.put("/:id",authMiddleware,isAdmin,updateCategory);
router.delete("/:id",authMiddleware,isAdmin,deleteCategory);
router.get("/",getAllCategory)
module.exports=router;