import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js"; // Import booking routes
import paymentRoutes from "./routes/paymentRoutes.js"; // Import payment routes

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);     // Register / Login
app.use("/api/users", userRoutes);    // Users CRUD
app.use("/api/rooms", roomRoutes);    // Rooms CRUD
app.use("/api/bookings", bookingRoutes); // Bookings CRUD
app.use("/api/payments", paymentRoutes); // Payments CRUD

// Root test route
app.get("/", (req, res) => {
  res.send("Room Finder API running...");
});

// Port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});