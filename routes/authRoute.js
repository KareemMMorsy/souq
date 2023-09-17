const express=require('express'); 
const { createUser,loginUserCtrl,getallUser, getaUser, deleteaUser, updateUser } = require('../controller/userCtrl');
const router= express.Router();


// register and login
router.post("/register",createUser);
router.post("/login",loginUserCtrl);

//get all users
router.get("/all-users",getallUser);

//get a single user
router.get("/:id",getaUser);

// delete a single user
router.delete("/:id",deleteaUser)

//update a user
router.put("/:id",updateUser)

module.exports=router; 