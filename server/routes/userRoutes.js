import express from "express";
import User from "../models/User.js"; // ✅ REQUIRED
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

    res.json(user); // ✅ return user directly
  } catch (error) {
    res.status(500).json({ message: "Failed to get user" });
  }
});

/**
 * 🔹 UPDATE CURRENT USER (Name / Email / Avatar)
 * PUT /api/users/me
 */
router.put("/me", protect, async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json(user); // ✅ VERY IMPORTANT
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
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
