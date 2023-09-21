const express = require('express');
const router = express.Router();
const {createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct}=require('../controller/productCtrl');
const {isAdmin, authMiddleware}=require('../middlewares/authMiddleware');

// fetch a product by id route
router.get('/:id',getaProduct);

//fetch all products
router.get('/',getAllProducts);

// update product 
router.put('/:id',authMiddleware,isAdmin,updateProduct);

//delete product
router.delete('/:id',authMiddleware,isAdmin,deleteProduct);

// create product route
router.post('/',authMiddleware,isAdmin,createProduct);

module.exports=router;
