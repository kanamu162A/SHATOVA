import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import auth_router from "./router/auth.router.js";
import users_route from "./router/dashboard.router.js";
import ResetPin from "./router/reset.route.js";
import path from "path";
import { fileURLToPath } from "url";
//import productRoutes from "./router/product.router.js"

dotenv.config();
const app = express();
const port =process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.use(cors());
app.use(express.json());

app.use("/api/shatova/V1/", users_route);
app.use("/api/shatova/V1/", auth_router);
app.use("/api/shatova/V1/", users_route);
app.use("/api/shatova/V1/", ResetPin);


app.listen(port, () => {
  console.log(`server running on http://localhost:${port} Successfully..`);
});

