import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";               
import { Server } from "socket.io";                
import auth_router from "./router/auth.router.js";
import users_route from "./router/dashboard.router.js";
import ResetPin from "./router/reset.route.js";
import messageRoutes from "./router/message.route.js";
import uploadsroutes from "./router/uploads.router.js"
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
app.use("/api/shatova/V1/", uploadsroutes);



const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",   
    methods: ["GET", "POST","DELETE","PUT","PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("chat message", (msg) => {
    console.log("Message received:", msg);
    socket.broadcast.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


httpServer.listen(port, () => {
  console.log(`server running on http://localhost:${port} Successfully..`);
});
