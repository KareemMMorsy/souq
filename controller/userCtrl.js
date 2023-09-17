const { generateToken } = require('../config/jwtToken');
const User=require('../models/userModel');
const asyncHandler=require('express-async-handler');

const createUser=asyncHandler(async(req,res)=>{
    const email=req.body.email;
    console.log(req.body);
    const findUser=await User.findOne({email:email});
    if(!findUser){
        //create a new user
        const newUser= await User.create(req.body);
        res.json(newUser);
    }else{
        //user already exist
       throw new Error("User Already Exist");
    }
});

//login controller

const loginUserCtrl = asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    // check user if exist or not
    const findUser=await User.findOne({email:email});

    if(findUser && (await findUser.isPasswordMatched(password))){
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token:generateToken(findUser?._id)
        });

    }else{
        throw new Error("invalid credentials");
    }
    console.log(email+password);
});

//get all users
const getallUser=asyncHandler(async(req,res)=>{
    try{
    const getUsers=await User.find();
    res.json(getUsers);
    }catch(err){
        throw new Error(err);
    }
})

//get single user
const getaUser = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    try{
        const getAUser=await User.findById(id);
        res.json({getAUser});
        
        console.log(id);
    }catch(err){
        throw new Error(err);
    }
})

//delete a user
const deleteaUser = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    try{
        const deleteAUser=await User.findByIdAndDelete(id);
        res.json({deleteAUser});
        
        console.log(id);
    }catch(err){
        throw new Error(err);
    }
})
// update user
const updateUser=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        const updatedUser= await User.findByIdAndUpdate(id,
            {
                firstname:req?.body?.firstname,
                lastname:req?.body?.lastname,
                email:req?.body?.email,
                mobile:req?.body?.mobile,
            },
            {
                new:true
            });
            res.json(updatedUser);

    }catch(err){
        throw new Error(err);
    }
})

module.exports={createUser,loginUserCtrl, getallUser,getaUser,deleteaUser,updateUser}