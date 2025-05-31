import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();
const SECRET_KEY =  process.env.SECRET_KEY;

const authenticateToken  = (req,res,next) =>{

    try{
        const authHeader =  req.headers["authorization"]
        if(!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({
            success:false,
            message:"No Token Is Provided"
        });

        const token = authHeader.split(' ')[1];

        const decoded = JWT.verify(token, SECRET_KEY)
            
            req.user = decoded
            next();
        
    }catch(error){
        return res.status(409).json({
            success:false,
            message:"Invalid or expired token"
        });
    };
};

export default authenticateToken;
