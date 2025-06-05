import express from 'express';
const router = express.Router();
import {
    getUserChats,
    checkUserExists,
    getMessagesBetweenUsers,
    sendMessage,
  } from '../controller/message.controller.js';
  

router.get('/user-chats/:phone', getUserChats);
router.get('/check-user/:phone', checkUserExists);
router.get('/messages', getMessagesBetweenUsers);
router.post('/send-message', sendMessage);

export default router;
