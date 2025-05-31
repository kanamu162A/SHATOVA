import express from "express";
const router = express.Router();
import {getAllUsers} from "../controller/auth.controller.js"
import authenticateToken from "../middleware/auth.middleware.js"
import { CreateAdmin } from "../controller/admin.controller.js";
import { getDashboard } from "../controller/dashboard.controller.js";


router.get("/users",authenticateToken, getAllUsers);
router.get("/dashboard",authenticateToken,getDashboard)
router.post("/admin",authenticateToken, CreateAdmin)
router.get("/", (req,res) => {
    res.send("hello form shatova")
});



export default router;