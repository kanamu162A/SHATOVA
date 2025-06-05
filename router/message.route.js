import express from 'express';
import {
  sendMessage,
  getMessages,
  checkUserRegistered,
  getUserChats
} from '../controller/message.controller.js';

const router = express.Router();

router.post('/send-message', sendMessage);
router.get('/messages', getMessages);
router.get('/check-user/:phone', checkUserRegistered);
router.get('/user-chats/:phone', getUserChats);

export default router;
