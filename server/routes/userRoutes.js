import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { getAllUsers, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🔹 GET CURRENT LOGGED-IN USER
 * GET /api/users/me
 */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user" });
  }
});

/**
 * 🔹 UPDATE CURRENT USER (Name / Email / Avatar / Password)
 * PUT /api/users/me
 */
router.put("/me", protect, async (req, res) => {
  try {
    const { name, email, avatar, password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (avatar) user.avatar = avatar;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");
    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: err.message || "Update failed" });
  }
});

/**
 * 🔹 GET ALL USERS
 */
router.get("/", protect, getAllUsers);

/**
 * 🔹 DELETE USER
 */
router.delete("/:id", protect, deleteUser);

export default router;
