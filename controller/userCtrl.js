const { generateToken } = require('../config/jwtToken');
const User=require('../models/userModel');
const asyncHandler=require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailCtrl');
const crypto=require('crypto');

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
        const refrehToken = await generateRefreshToken(findUser?._id);
        const updateUser= await User.findByIdAndUpdate(findUser._id,{refreshToken:refrehToken},{new:true});
        console.log(updateUser);
        //from npm i cookie parser
        res.cookie('refreshToken',refrehToken,{
            httpOnly: true,
            maxAge: 72*60*60*1000
        })
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

//handler refresh token


const handleRefreshToken = asyncHandler(async(req,res)=>{
const cookie=req.cookies;
console.log("cookies is "+cookie);
if(!cookie?.refreshToken){
    throw new Error('no refresh token in cookies');
}
const refreshToken =cookie.refreshToken;
console.log(refreshToken);

const user= await User.findOne({refreshToken});
if(!user) throw new Error('no refresh token present in db or not matched');
jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
    if(err||user.id!==decoded.id){
        throw new Error('there is something wrong with your refresh token');
    }
    const accessToken=generateToken(user?.id);
    res.json({accessToken})
});
res.json(user)
});

//log out

const logout=asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw new Error('no refresh token in cookies');
    }
    const refreshToken =cookie.refreshToken;
    const user= await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken",{httpOnly:true,secure:true});
        return res.sendStatus(204);//forbiden

    }
    await User.findOneAndUpdate({refreshToken},{
        refreshToken:"",
    });
    res.clearCookie("refreshToken",{httpOnly:true,secure:true});
        res.sendStatus(204);//forbiden
})

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
    validateMongoDbId(id);
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
    validateMongoDbId(id);
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
    const {_id}=req.user;
    try{
        validateMongoDbId(_id);
        const updatedUser= await User.findByIdAndUpdate(
            _id,
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
const blockUser=asyncHandler(async(req,res)=>{
    const {id} =req.params;
    validateMongoDbId(id);
    try{
        const block=await User.findByIdAndUpdate(id,{isBlocked:true},{new:true});
        res.json({message:"user blocked"});
    }catch(err){
        throw new Error(err);
    }

});
const unblockUser=asyncHandler(async(req,res)=>{
    const {id} =req.params;
    validateMongoDbId(id);
    try{
        const unblock=await User.findByIdAndUpdate(id,{isBlocked:false},{new:true});
        res.json({message:"user unblocked"});
    }catch(err){
        throw new Error(err);
    }
});

//update password
const updatePassword = asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password=password;
        const updatedPassword= await user.save();
        res.json(updatedPassword);
    }else{
        res.json(user);
    }


});

const forgotPasswordToken=asyncHandler(async(req,res)=>{
    const {email}=req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error("your email is incorrect");
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        console.log("hiii"+user.passwordResetToken);
        const resetURL='hi please follow this link to reset your password,this link valid 10 minutes only </br> <a href="http://localhost:5000/api/user/reset-password/'+token+'">click here </a>'
        const data={
            to:email,
            subject:'forgot password link',
            text:'hey user',
            html:resetURL
        };
        sendEmail(data);
        res.json(token);

    }catch(err)
    {
        throw new Error(err);
    }


});

const resetPassword=asyncHandler( async(req,res) => {
    const {password}= req.body;
    const {token} = req.params;
    const hashedToken=crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashedToken);
    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires:{$gt:Date.now()}
    });
    if(!user) throw new Error('Token Expired, please try again');
    user.password=password;
    user.passwordResetToken= undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    res.json(user);


});

module.exports={
    createUser
    ,loginUserCtrl
    , getallUser
    ,getaUser
    ,deleteaUser
    ,updateUser
    ,blockUser
    ,unblockUser
    ,handleRefreshToken
    ,logout
    ,updatePassword
    ,forgotPasswordToken
    ,resetPassword
}