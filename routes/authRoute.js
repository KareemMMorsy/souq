const express=require('express'); 
const { createUser,loginUserCtrl,getallUser, getaUser, deleteaUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router= express.Router();


// register and login
router.post("/register",createUser);
router.post("/login",loginUserCtrl);

//get all users
router.get("/all-users",getallUser);

// logout user
router.get("/logout",logout)

// handle refresh token
router.get("/refresh",handleRefreshToken)


//get a single user
router.get("/:id",authMiddleware,isAdmin,getaUser);

// delete a single user
router.delete("/:id",deleteaUser)

//update a user
router.put("/edit-user/:id",authMiddleware,isAdmin,updateUser)

//block user
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser)

//unblock user
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser)



module.exports=router; 