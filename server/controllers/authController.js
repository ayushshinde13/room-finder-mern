import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * REGISTER USER
 * POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    email = email.trim().toLowerCase();
    name = name.trim();

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const safeRegex = new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i");
    const userExists = await User.findOne({ email: { $regex: safeRegex } });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role ? role.toUpperCase() : "RENTER",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`,
    });

    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        coins: user.coins || 0,
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

/**
 * LOGIN USER
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      console.log("[LOGIN] Missing email or password:", req.body);
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    email = email.trim();

    // Find user by case-insensitive email
    const safeRegex = new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i");
    const user = await User.findOne({ email: { $regex: safeRegex } });

    if (!user) {
      console.log(`[LOGIN] User not found for email: "${email}"`);
      return res.status(400).json({ 
        message: "No account found with this email address. Please create an account or check for typos." 
      });
    }

    // Support both bcrypt-hashed passwords and legacy plaintext upgrade
    let isMatch = false;
    const isBcrypt = typeof user.password === "string" && (
      user.password.startsWith("$2a$") || 
      user.password.startsWith("$2b$") || 
      user.password.startsWith("$2y$")
    );

    if (isBcrypt) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (password === user.password);
      if (isMatch) {
        // Upgrade legacy unhashed password to bcrypt hash
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!isMatch) {
      console.log(`[LOGIN] Incorrect password entered for: "${email}"`);
      return res.status(400).json({ 
        message: "Incorrect password. Please try again or click 'Forgot password?' to reset it." 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_fallback_secret",
      { expiresIn: "7d" }
    );

    console.log(`[LOGIN SUCCESS] User logged in: ${user.email} (${user.role})`);

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`,
        coins: user.coins || 0,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

/**
 * FORGOT PASSWORD
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide your email address" });
    }

    email = email.trim();

    const safeRegex = new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i");
    const user = await User.findOne({ email: { $regex: safeRegex } });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email address" });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and save in user document with 15-minute expiration
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Create reset URL
    const resetUrl = `/reset-password/${resetToken}`;

    console.log(`[PASSWORD RESET] Reset Token for ${user.email}: ${resetToken}`);
    console.log(`[PASSWORD RESET] Link: ${resetUrl}`);

    res.json({
      success: true,
      message: "Password reset link generated successfully",
      resetToken,
      resetUrl,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: error.message || "Failed to process forgot password request" });
  }
};

/**
 * RESET PASSWORD
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the token provided in the URL to match with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired password reset token" });
    }

    // Hash new password and clear reset token fields
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password has been successfully reset. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: error.message || "Failed to reset password" });
  }
};
