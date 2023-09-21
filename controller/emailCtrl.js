const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async(data,req,res)=>{
   
    let transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth: {
            user:process.env.MAIL_ID,
            pass: process.env.MP
        }
    });

    // send email with defined transport object
    let info=await transporter.sendMail({
        from:'"kareem morsy" <kareemmorsy555@gmail.com>',//sender
        to: data.to,//list of recievers
        subject: data.subject,
        text: data.text,
        html:data.html, //html body
    });
})
module.exports=sendEmail;