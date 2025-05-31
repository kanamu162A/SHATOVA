import express from "express"
const router  = express.Router();
import { ResetPin_code,updateUserinfo } from "../controller/reset.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";


router.put("/pincode/:id",authenticateToken,ResetPin_code);
router.patch("/reset/info/:id",authenticateToken,updateUserinfo);

export default router;
