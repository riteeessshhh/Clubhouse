import { Router } from "express";
import Message from "../models/Message.js";
import { verifyToken } from "../utils/jwt.js";

const router = Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    // Fetch messages from the database
    const messages = await Message.find().select("title text");

    res.render("messages", { messages });
  } catch (error) {
    res.status(500).render("error", { message: "Server error", error });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().populate("user", "fullName");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
