import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

/**
 * PROCESS PAYMENT FOR BOOKING (Locks room upon successful payment)
 */
export const processPayment = async (req, res) => {
  try {
    const { bookingId, roomId, amount, paymentMethod, paymentDetails } = req.body;

    let targetBooking = null;

    if (bookingId) {
      targetBooking = await Booking.findById(bookingId).populate("room").populate("renter");
      if (!targetBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      if (targetBooking.renter._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to pay for this booking" });
      }
    } else if (roomId) {
      // Direct instant payment: create booking
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      if (room.isBooked) {
        return res.status(400).json({ message: "Room is already booked" });
      }
      targetBooking = await Booking.create({
        room: roomId,
        renter: req.user._id,
        owner: room.owner,
        status: "PENDING"
      });
      await targetBooking.populate("room");
    } else {
      return res.status(400).json({ message: "Booking ID or Room ID required" });
    }

    const targetRoomId = targetBooking.room?._id || targetBooking.room;
    const room = await Room.findById(targetRoomId);
    if (!room) {
      return res.status(404).json({ message: "Associated room not found" });
    }
    if (room.isBooked) {
      return res.status(400).json({ message: "This room is already booked by another tenant" });
    }

    // Generate unique Transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;

    // Create completed payment record directly crediting the owner
    const payment = await Payment.create({
      userId: req.user._id,
      ownerId: room.owner,
      roomId: room._id,
      bookingId: targetBooking._id,
      amount: amount || room.rent,
      currency: "INR",
      paymentMethod: paymentMethod || "CARD",
      paymentStatus: "COMPLETED",
      transactionId: transactionId,
    });

    // 1. Mark Booking as BOOKED
    targetBooking.status = "BOOKED";
    await targetBooking.save();

    // 2. Mark Room as isBooked = true ONLY AFTER successful payment
    room.isBooked = true;
    room.bookedBy = req.user._id;
    await room.save();

    // 3. Award 50 loyalty coins to renter
    await User.findByIdAndUpdate(req.user._id, { $inc: { coins: 50 } });

    // Populate booking response
    const updatedBooking = await Booking.findById(targetBooking._id)
      .populate("room", "title location rent bhkType imageUrl isBooked")
      .populate("renter", "name email")
      .populate("owner", "name email");

    res.status(200).json({
      success: true,
      message: "Payment completed successfully! The room is officially booked.",
      payment,
      booking: updatedBooking,
      transactionId,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * INITIATE PAYMENT (Intent / Preview)
 */
export const initiatePayment = async (req, res) => {
  try {
    const { roomId, bookingId, amount } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('room')
      .populate('renter');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.renter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to pay for this booking" });
    }

    const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    const payment = await Payment.create({
      userId: req.user._id,
      roomId: roomId,
      bookingId: bookingId,
      amount: amount,
      paymentMethod: "ONLINE",
      paymentStatus: "PENDING",
      transactionId: transactionId,
    });

    res.status(200).json({
      success: true,
      message: "Payment intent initiated",
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
      .populate('roomId', 'title location rent imageUrl')
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
 * GET PAYMENT RECEIPT BY BOOKING ID
 */
export const getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ bookingId: req.params.bookingId })
      .populate("userId", "name email avatar")
      .populate("ownerId", "name email avatar")
      .populate({
        path: "roomId",
        select: "title location rent imageUrl bhkType owner",
        populate: {
          path: "owner",
          select: "name email avatar"
        }
      })
      .sort({ createdAt: -1 });

    if (!payment) {
      return res.status(404).json({ message: "Payment receipt not found" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error fetching booking payment:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PAYMENTS BY USER (RENTER TRANSACTION LOG)
 */
export const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate({
        path: 'roomId',
        select: 'title location rent imageUrl bhkType owner',
        populate: {
          path: 'owner',
          select: 'name email avatar'
        }
      })
      .populate('ownerId', 'name email avatar')
      .populate('bookingId', 'status createdAt refundAmount deductionAmount')
      .sort({ createdAt: -1 });

    const totalSpent = payments
      .filter(p => p.type === 'RENT_PAYMENT' && p.paymentStatus === 'COMPLETED')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalRefunded = payments
      .filter(p => p.type === 'REFUND' && p.paymentStatus === 'COMPLETED')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      payments,
      totalSpent,
      totalRefunded,
      walletBalance: totalRefunded,
      count: payments.length
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PAYMENTS FOR OWNER (OWNER WALLET EARNINGS & REVENUE LOG)
 */
export const getPaymentsForOwner = async (req, res) => {
  try {
    // 1. Find all rooms owned by this user
    const ownerRooms = await Room.find({ owner: req.user._id }).select('_id');
    const roomIds = ownerRooms.map(r => r._id);

    // 2. Find all payments made for these rooms or where ownerId is current user
    const payments = await Payment.find({ 
      $or: [
        { roomId: { $in: roomIds } },
        { ownerId: req.user._id }
      ],
      paymentStatus: 'COMPLETED'
    })
      .populate('userId', 'name email avatar')
      .populate('roomId', 'title location rent imageUrl bhkType')
      .populate('bookingId', 'status createdAt refundAmount deductionAmount')
      .sort({ createdAt: -1 });

    // Deduplicate in case of matching both
    const uniquePayments = [];
    const seen = new Set();
    for (const p of payments) {
      if (!seen.has(p._id.toString())) {
        seen.add(p._id.toString());
        uniquePayments.push(p);
      }
    }

    const totalEarnings = uniquePayments
      .filter(p => p.type === 'RENT_PAYMENT' || p.type === 'RETENTION_FEE')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      payments: uniquePayments,
      totalEarnings,
      count: uniquePayments.length
    });
  } catch (error) {
    console.error("Error fetching payments for owner:", error);
    res.status(500).json({ message: error.message });
  }
};