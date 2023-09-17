const { default: mongoose } = require("mongoose");

mongoose
const dbConnect = ()=>{
    try{
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("database connected sucessfully");
    }catch(err){
        console.log("database err:"+err);
    }
};
module.exports=dbConnect;