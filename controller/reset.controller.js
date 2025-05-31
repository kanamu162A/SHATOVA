import dotenv from "dotenv"
import pool from "../config/database.js";
import bcrypt from "bcryptjs";

dotenv.config();

export const ResetPin_code =  async(req,res) =>{

    const {id} = req.params;
    const {phone,pin_code} = req.body;
    
    if(!phone || !pin_code){
        return res.status(401).json({
            success:false,
            message:"please provide all required fields."
        });
    };

    try {

        const checkUserQuery  = `SELECT * FROM auth WHERE phone = $1`;
        const checkUserData   = [phone];
        const checkUserResult = await pool.query(checkUserQuery,checkUserData);

        if(checkUserResult.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        };

        const user = checkUserResult.rows[0]

        if(user.id !== parseInt(id)){
            return res.status(401).json({
                success:false,
                message:"Sorry, The Phone Number and ID not Match"
            });
        };

        const hashPincode  = await bcrypt.hash(pin_code,10)

        const updateQuery  = `UPDATE auth set pin_code = $1 WHERE id = $2 RETURNING *`;
        const updateData   = [hashPincode,id];
        const updateResult = await pool.query(updateQuery,updateData)

        return res.status(200).json({
            success:true,
            message:"User Updated Successfully.....",
            result:updateResult.rows[0]
        })
    }catch(err) {
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        });
    };
};

export const updateUserinfo = async (req, res) => {
    const { id } = req.params;
    const {first_name,last_name,phone,email,password } = req.body
  
    if(!first_name && !last_name && !phone && !email && !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update.",
      });
    }
  
    try {
      const fields = [];
      const values = [];
      let index = 1;
  
      if (first_name) {
        fields.push(`first_name = $${index++}`);
        values.push(first_name);
      }
  
      if (last_name) {
        fields.push(`last_name = $${index++}`);
        values.push(last_name);
      }
  
      if (phone) {
        fields.push(`phone = $${index++}`);
        values.push(phone);
      }
  
      if (email) {
        fields.push(`email = $${index++}`);
        values.push(email);
      }
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push(`password = $${index++}`);
        values.push(hashedPassword);
      }
  
      values.push(id); 
  
      const query = `UPDATE auth SET ${fields.join(", ")} WHERE id = $${index} 
      RETURNING id, role, first_name, last_name, phone, email, pin_code, password`;
  
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      };
  
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: result.rows[0],
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message, 
      });
    };
  };
     