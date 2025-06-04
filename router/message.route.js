import express from "express";
import { getUsers, getMessages, sendMessage } from "../controller/message.controller.js";

const router = express.Router();


router.get("/users", getUsers);
router.get("/messages", getMessages);
router.post("/messages", sendMessage);

export default router;
