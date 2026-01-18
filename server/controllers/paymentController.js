import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

/**
 * INITIATE PAYMENT FOR BOOKING
 */
export const initiatePayment = async (req, res) => {
  try {
    const { roomId, bookingId, amount } = req.body;

    // Verify booking exists and belongs to the user
    const booking = await Booking.findById(bookingId)
      .populate('room')
      .populate('renter');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.renter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to pay for this booking" });
    }

    // Generate a dummy transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    // Create payment record
    const payment = await Payment.create({
      userId: req.user._id,
      roomId: roomId,
      bookingId: bookingId,
      amount: amount,
      paymentMethod: "DUMMY_PAYMENT",
      paymentStatus: "PENDING",
      transactionId: transactionId,
    });

    // Simulate payment processing (in a real app, this would integrate with a payment gateway)
    // For this demo, we'll immediately mark the payment as completed
    setTimeout(async () => {
      try {
        payment.paymentStatus = "COMPLETED";
        await payment.save();

        // DO NOT automatically approve the booking - owner approval is still required
        // Only award reward coins to the renter after successful payment
        await User.findByIdAndUpdate(
          booking.renter._id,
          { $inc: { coins: 10 } },
          { new: true }
        );
      } catch (err) {
        console.error("Error completing payment process:", err);
      }
    }, 2000); // Simulate 2 seconds processing time

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      paymentId: payment._id,
      transactionId: transactionId,
      amount: amount,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * VERIFY PAYMENT
 */
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('userId', 'name email coins')
      .populate('roomId', 'title location rent')
      .populate('bookingId');

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PAYMENTS BY USER
 */
export const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('roomId', 'title')
      .populate('bookingId', 'status')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PAYMENTS FOR OWNER
 */
export const getPaymentsForOwner = async (req, res) => {
  try {
    // Get all bookings made for rooms owned by this user
    const payments = await Payment.find({})
      .populate({
        path: 'bookingId',
        populate: [{
          path: 'room',
          match: { owner: req.user._id } // Only rooms owned by the current user
        }]
      })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Filter to only include payments for the owner's rooms
    const ownerPayments = payments.filter(payment => payment.bookingId.room);

    res.json(ownerPayments);
  } catch (error) {
    console.error("Error fetching payments for owner:", error);
    res.status(500).json({ message: error.message });
  }
};