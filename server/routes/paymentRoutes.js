import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  processPayment,
  initiatePayment, 
  verifyPayment, 
  getPaymentByBooking,
  getPaymentsByUser,
  getPaymentsForOwner
} from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payments/process - Complete checkout and book room
router.post("/process", protect, processPayment);

// POST /api/payments/initiate - Initiate intent
router.post("/initiate", protect, initiatePayment);

// GET /api/payments/receipt/:bookingId - Fetch receipt for booking
router.get("/receipt/:bookingId", protect, getPaymentByBooking);

// GET /api/payments/owner - Get owner received payments
router.get("/owner", protect, getPaymentsForOwner);

// GET /api/payments/:paymentId - Verify a payment
router.get("/:paymentId", protect, verifyPayment);

// GET /api/payments - Get user's payment history
router.get("/", protect, getPaymentsByUser);

export default router;