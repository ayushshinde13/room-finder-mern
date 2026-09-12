import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  createBooking, 
  getUserBookings, 
  getOwnerBookings, 
  updateBookingStatus,
  requestLeaveRoom,
  approveLeaveRoom,
  rejectLeaveRoom
} from "../controllers/bookingController.js";

const router = express.Router();

// POST /api/bookings - Create a booking (renter only)
router.post("/", protect, createBooking);

// GET /api/bookings/my - Get user's bookings (renter only)
router.get("/my", protect, getUserBookings);

// GET /api/bookings/owner - Get owner's booking requests (owner only)
router.get("/owner", protect, getOwnerBookings);

// PUT /api/bookings/:id - Update booking status
router.put("/:id", protect, updateBookingStatus);

// POST /api/bookings/:id/request-leave - Renter requests to vacate room
router.post("/:id/request-leave", protect, requestLeaveRoom);

// POST /api/bookings/:id/approve-leave - Owner approves vacation & triggers 30-70 split
router.post("/:id/approve-leave", protect, approveLeaveRoom);

// POST /api/bookings/:id/reject-leave - Owner rejects vacation request
router.post("/:id/reject-leave", protect, rejectLeaveRoom);

export default router;