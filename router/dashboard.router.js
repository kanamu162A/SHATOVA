import express from "express";
const router = express.Router();
import {getAllUsers} from "../controller/auth.controller.js"
import authenticateToken from "../middleware/auth.middleware.js"
import { CreateAdmin } from "../controller/admin.controller.js";
import { getDashboard } from "../controller/dashboard.controller.js";
import authorizeRoles from "../middleware/authorize.middleware.js";


router.get("/users",authenticateToken,authorizeRoles("admin","C E O"), getAllUsers);
router.get("/dashboard",authenticateToken,getDashboard)
router.post("/admin",authenticateToken,authorizeRoles(" C E O"), CreateAdmin)



export default router;