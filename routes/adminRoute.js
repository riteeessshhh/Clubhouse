import { Router } from "express";
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

const router = Router();

router.post("/", verifyToken, async (req, res) => {
  const { answer } = req.body;
  const userId = req.user.id;

  const correctAns = "human";

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (correctAns === answer) {
      user.isAdmin = true;
      await user.save();
      return res.status(200).json({ message: "You are now an admin" });
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

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins Only" });
    }

    const messages = await Message.find().populate("user", "fullName email");

    res.status(200).render("adminPage", { messages });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.delete("/delete-message/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }

    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

router.get("/all-users", verifyToken, async (req, res) => {
  const userId = req.user.id; // Get the user ID from the JWT

  try {
    // Find the user who is attempting to access the route
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can view all users" });
    }

    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
