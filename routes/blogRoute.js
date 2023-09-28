const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require('../controller/blogCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadimages');
const router= express.Router();
//get  all blogs route
router.get("/",getAllBlogs);

//get blog by id route
router.get("/view-blog/:id",getBlog);


router.put('/upload/:id'
,authMiddleware
,isAdmin
,uploadPhoto.array('images',10)
,blogImgResize
,uploadImages);

//create a blog route
router.post("/",createBlog);

//update a blog bi id route
router.put("/update-blog/:id",updateBlog);

//delete a blog by id route
router.delete("/:id",deleteBlog);

// like a blog
router.put("/likes",authMiddleware,likeBlog)

// dislike a blog
router.put("/dislikes",authMiddleware,dislikeBlog)

module.exports=router;