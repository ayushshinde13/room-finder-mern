import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBooking, getUserBookings, getOwnerBookings, updateBookingStatus } from "../controllers/bookingController.js";

const router = express.Router();

// POST /api/bookings - Create a booking (renter only)
router.post("/", protect, createBooking);

// GET /api/bookings/my - Get user's bookings (renter only)
router.get("/my", protect, getUserBookings);

// GET /api/bookings/owner - Get owner's booking requests (owner only)
router.get("/owner", protect, getOwnerBookings);

// PUT /api/bookings/:id - Update booking status (owner only)
router.put("/:id", protect, updateBookingStatus);

export default router;