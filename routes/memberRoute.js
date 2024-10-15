import { Router } from "express";
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

const router = Router();

// Riddle answer check to become a member
router.post("/", verifyToken, async (req, res) => {
  const { answer } = req.body;
  const userId = req.user.id;

  const correctAns = "comb";

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (correctAns === answer) {
      user.isMember = true;
      await user.save();
      return res.status(200).json({ message: "You are now a member" });
    } else {
      return res.status(400).json({ message: "Incorrect answer, try again" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/view", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isMember) {
      // User is not a member, return a message or redirect them
      return res
        .status(403)
        .json({ message: "You must answer the riddle to become a member." });
    }

    // Fetch messages from the database
    const messages = await Message.find({}).populate("user", "fullName");

    // Pass messages to the memberPage
    res.render("memberPage", { messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create message (only accessible to members)
router.post("/create", verifyToken, async (req, res) => {
  const { title, text } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    // Check if the user is a member
    if (!user.isMember) {
      return res
        .status(403)
        .json({ message: "Only members can create messages" });
    }

    // If the user is a member, allow message creation
    const newMessage = new Message({
      title,
      text,
      user: userId,
    });
    await newMessage.save();
    res
      .status(201)
      .json({ message: "Message created successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
