import pool from "../config/database.js";
import bcrypt from 'bcryptjs';


export const CreateAdmin = async(req,res) =>{
    
    const {phone,pin_code} = req.body;
    if(!phone || !pin_code){

        return res.status(401).json({
            success:false,
            message:"Please provide all required fields.",
        });
    };

    try{

        const checkUserQuery  = `SELECT * FROM auth WHERE phone = $1 `;
        const checkUserData   = [phone];
        const checkUserResult = await pool.query(checkUserQuery,checkUserData);

        if(checkUserResult.rows.length === 0) {

            return res.status(404).json({
                success:false,
                message:"User Not Found."
            });
        };

        const user = checkUserResult.rows[0];

        if(user.role === 'ADMIN'||'C E O'){

            return res.status(403).json({
                success:false,
                message:"Already has admin role...."

            })
        };

        const hashedPassword = await bcrypt.hash(pin_code, 10)
        
        const Query  = `UPDATE auth SET  pin_code = $1 ,role = 'ADMIN'  WHERE phone = $2`;
        const Value  = [hashedPassword,phone];
        const Result = await pool.query(Query,Value);

        return res.status(200).json({
            success:true,
            message:"successfully converted to admin role...",
            user:Result.rows[0]
        });

    }catch(err){
        return res.status(501).json({
            success:false,
            message:"Server error, please try gain later.",
            error:err.message
        });
    };
};

