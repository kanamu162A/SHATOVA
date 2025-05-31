import dotenv from "dotenv";
import pool from "../config/database.js";

dotenv.config();

export const getDashboard = async(req,res) => {

    try{

        const id = req.user.id

        const Query = `SELECT id,balance,first_name,last_name,phone,email,role FROM auth WHERE id =  $1`;
        const Value =[id];
        const Result = await pool.query(Query,Value);
        
        if(Result.rows.length === 0) {
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        };

        const user = Result.rows[0]

        return res.status(200).json({
            success:true,
            message:`Hi! ${user.first_name}, Welcome to shatova ${user.role} Dashboard... `,
            user:Result.rows[0]
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error, Please try again",
            error:err.message
        });
    };
};

