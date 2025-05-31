import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import auth_router from "./router/auth.router.js";
import users_route from "./router/dashboard.router.js";
import  ResetPin  from "./router/reset.route.js"


dotenv.config();
const app = express();
const port =  process.env.PORT || 5000;

app.get("/", (req,res) => {
    res.status(200).json({
        success:true,
        message:"welcome to shatova  uncle fadeel...."
    })
});


app.use(cors());
app.use(express.json());
app.use("/api/shatova/V1/",auth_router);
app.use("/api/shatova/V1/",users_route);
app.use("/api/shatova/V1/",ResetPin);



app.listen(port, () =>{

    console.log(`server running on http://localhost:${port} Successfully..`);
    
});
