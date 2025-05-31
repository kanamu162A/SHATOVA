import pool from "../config/database.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

dotenv.config();
const SECRET_KEY =  process.env.SECRET_KEY;

export const getAllUsers = async(req,res) =>{

    try{
        const Query = 'SELECT * FROM auth ';
        const result = await pool.query(Query);

        const user = result.rows[1];

        return res.status(300).json({

            success:true,
            message:`Hi! ${user.first_name } ${user.last_name},welcome to shatova company..`,
            user:result.rows
        })
    }catch(err){

        return res.status(501).json({
            success:false,
            message:"Server error Please try again later...",
            error:err.message
        });
    };
};


export const register = async(req,res) =>{
    const {first_name,last_name,phone,email,password} = req.body;


    if(!first_name || !last_name || !phone || !email || !password){
        return res.status(401).json({
            success:false,
            message:"please provide all required fields"
        });
    };

    try{
        const checkUserQuery  = `SELECT * FROM auth WHERE phone = $1 OR email = $2`;
        const checkUserData = [phone,email] ;
        const checkUserResult = await pool.query(checkUserQuery,checkUserData);

        if(checkUserResult.rows.length >0){

            return res.status(403).json({
                success:false,
                message:"The phone and email is already registerd"
            });
    
        };

        const hashedPassword =  await bcrypt.hash(password,10);

        const Query  = `INSERT INTO auth (first_name,last_name,phone,email,password) VALUES($1,$2,$3,$4,$5) RETURNING *`;
        const Values = [first_name,last_name,phone,email,hashedPassword];
        const result = await pool.query(Query,Values);

        return res.status(200).json({

            success:true,
            message:"YOu have successfully registerd.",
            user:result.rows[0]
            
        });
        

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"Server error, Please Try Again Later",
            error:err.message
        });
    };
};


export const login = async(req,res) =>{
    const {phone, password} = req.body;

    if(!phone || !password){
        return res.status(401).json({
            success:false,
            message:"Please provide all required fields"
        });
    };

    try{
        const ExistingUserQuery  = `SELECT * FROM auth WHERE phone = $1 `;
        const ExistingUserData   = [phone];
        const ExistingUserResult = await pool.query(ExistingUserQuery,ExistingUserData);

        if(ExistingUserResult.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        };

        const user = ExistingUserResult.rows[0]
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({
            success:false,
            message:"Invalid Password , Please try again later"
        });

        const token = JWT.sign({
            id:user.id,
            role:user.role,
            first_name:user.first_name
        },SECRET_KEY,{expiresIn:"10m"});

        return res.status(200).json({
            success:true,
            message:"You have successfully login",
            token:token
        })
    }catch(error){

        return res.status(500).json({
            success:false,
            message:"Server error, please try again later",
            error:err.message
        });
    };
};