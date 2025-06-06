import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import  pool  from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // User joins with phone number
  socket.on('register', (phone) => {
    onlineUsers.set(phone, socket.id);
    console.log(`${phone} connected with ID: ${socket.id}`);
  });

  // Send message from sender to receiver
  socket.on('private message', async ({ sender, receiver, message }) => {
    // Save to database
    await pool.query(
      'INSERT INTO messages (sender_phone, receiver_phone, message) VALUES ($1, $2, $3)',
      [sender, receiver, message]
    );

    // Send to receiver if online
    const receiverSocketId = onlineUsers.get(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('private message', {
        sender,
        message
      });
    }
  });

  socket.on('disconnect', () => {
    for (const [phone, id] of onlineUsers) {
      if (id === socket.id) {
        onlineUsers.delete(phone);
        console.log(`${phone} disconnected`);
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
