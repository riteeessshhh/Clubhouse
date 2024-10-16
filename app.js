import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import memberRoute from "./routes/memberRoute.js";
import adminRoute from "./routes/adminRoute.js";
import { logout } from "./controllers/userController.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    w: "majority", 
    wtimeoutMS: 5000, 
  })

  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/member", memberRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/logout", logout);

app.listen(PORT, () => {
  console.log(`App listening at PORT ${PORT}`);
});
