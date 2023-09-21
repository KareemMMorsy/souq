// not found

const notFound=(req,res)=>{
    const error= new Error("Not Found: "+req.originaUrl);
    res.status(404);
    next(error);
}

// Error handler
const errorHandler=(err,req,res,next)=>{
const statuscode=res.statusCode==200 ? 500 : res.statusCode;
res.status(statuscode);
res.json({
    message: err?.message,
    stack: err?.stack
});

}
module.exports={errorHandler,notFound};