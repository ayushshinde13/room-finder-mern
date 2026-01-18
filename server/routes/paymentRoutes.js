import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  initiatePayment, 
  verifyPayment, 
  getPaymentsByUser 
} from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payments/initiate - Initiate a payment for booking
router.post("/initiate", protect, initiatePayment);

// GET /api/payments/:paymentId - Verify a payment
router.get("/:paymentId", protect, verifyPayment);

// GET /api/payments - Get user's payment history
router.get("/", protect, getPaymentsByUser);

export default router;