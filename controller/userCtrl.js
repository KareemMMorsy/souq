const User=require('../models/userModel');
const 

const createUser=async(req,res)=>{
    const email=req.body.email;
    console.log(req.body);
    const findUser=await User.findOne({email:email});
    if(!findUser){
        //create a new user
        const newUser= await User.create(req.body);
        res.json(newUser);
    }else{
        //user already exist
        res.json({msg:"user already exist", success: false});
    }
}
module.exports={createUser}