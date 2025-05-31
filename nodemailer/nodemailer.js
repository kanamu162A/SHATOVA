import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transpoter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        USER:process.env.EMAIL,
        PASS:process.env.PASS
    }
});


const SendAlertEmail  = async(tomail, subject, messege) =>{

    try{
        await transpoter.sendMail({
            from:process.env.EMAIL,
            to:tomail,
            subject,
            text:messege
        });


    }catch(error){
        console.error("Fail To Send Alert",error.messege)
    };
};

export default SendAlertEmail;