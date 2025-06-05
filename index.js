import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";                // <-- import http for server creation
import { Server } from "socket.io";    // <-- import Socket.IO
import auth_router from "./router/auth.router.js";
import users_route from "./router/dashboard.router.js";
import ResetPin from "./router/reset.route.js";
import messageRoutes from "./router/message.route.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.use(cors());
app.use(express.json());
app.use("/api/shatova/V1/", auth_router);
app.use("/api/shatova/V1/", users_route);
app.use("/api/shatova/V1/", ResetPin);
app.use("/api/shatova/V1/", messageRoutes);

// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.IO server attached to HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict to your frontend domain
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // Listen for a custom event, e.g., 'sendMessage'
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);

    // Broadcast the message to all clients except sender
    socket.broadcast.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});

// Use the HTTP server to listen (instead of app.listen)
server.listen(port, () => {
  console.log(`server running on http://localhost:${port} Successfully..`);
});
