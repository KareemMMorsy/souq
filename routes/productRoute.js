const express = require('express');
const router = express.Router();
const {createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages}=require('../controller/productCtrl');
const {isAdmin, authMiddleware}=require('../middlewares/authMiddleware');

const {uploadPhoto,productImgResize}=require('../middlewares/uploadimages');

// fetch a product by id route
router.get('/:id',getaProduct);

//fetch all products
router.get('/',getAllProducts);

router.put('/upload/:id'
,authMiddleware
,isAdmin
,uploadPhoto.array('images',10)
,productImgResize
,uploadImages);

//rating
router.put('/rating',authMiddleware,rating);

// update product 
router.put('/:id',authMiddleware,isAdmin,updateProduct);

//delete product
router.delete('/:id',authMiddleware,isAdmin,deleteProduct);

// create product route
router.post('/',authMiddleware,isAdmin,createProduct);

// add to wishlist
router.put('/wishlist/:id',authMiddleware,addToWishlist);

module.exports=router;
