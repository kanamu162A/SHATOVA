import dotenv from "dotenv";
import pkg from "pg"
const  {Pool} = pkg;

dotenv.config();

const pool =  new Pool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
      }
    
});



pool.connect((err) =>{
    if(!err){
        console.log(`Database Connected Successfully..`);
        
    }else{
        console.log('Fail to connect to database ',err.message);
        
    };
});

export default pool;
