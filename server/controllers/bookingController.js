import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

/**
 * CREATE BOOKING
 */
/**
 * CREATE BOOKING
 */
export const createBooking = async (req, res) => {
  try {
    const { roomId } = req.body;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if room is already booked
    if (room.isBooked) {
      return res.status(400).json({ message: "Room is currently booked by another tenant" });
    }

    // Clean up any old rejected/cancelled records for this user & room
    await Booking.deleteMany({
      room: roomId,
      renter: req.user._id,
      status: { $in: ["REJECTED", "CANCELLED"] }
    });

    // Check if user currently has an ACTIVE booking/request for this room
    const existingActiveBooking = await Booking.findOne({
      room: roomId,
      renter: req.user._id,
      status: { $in: ["PENDING", "APPROVED", "BOOKED", "LEAVE_REQUESTED"] }
    });

    if (existingActiveBooking) {
      return res.status(400).json({ message: "You already have an active request or booking for this room" });
    }

    // Create booking
    const booking = await Booking.create({
      room: roomId,
      renter: req.user._id,
      owner: room.owner,
      status: "PENDING"
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET USER'S BOOKINGS (RENTER)
 */
export const getUserBookings = async (req, res) => {
  try {
    // Automatically purge rejected and cancelled bookings for a clean renter dashboard
    await Booking.deleteMany({
      renter: req.user._id,
      status: { $in: ["REJECTED", "CANCELLED"] }
    });

    const bookings = await Booking.find({
      renter: req.user._id,
      status: { $nin: ["REJECTED", "CANCELLED"] }
    })
      .populate("room", "title location rent bhkType imageUrl isBooked")
      .populate("owner", "name email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET OWNER'S BOOKING REQUESTS
 */
export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("room", "title location rent bhkType imageUrl isBooked")
      .populate("renter", "name email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BOOKING STATUS (APPROVE/REJECT/CANCEL)
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["PENDING", "APPROVED", "REJECTED", "CANCELLED", "BOOKED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find booking and check if user is authorized to update
    const booking = await Booking.findById(req.params.id).populate("room");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is the owner of the room OR the renter who made the booking
    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isRenter = booking.renter.toString() === req.user._id.toString();
    
    if (!isOwner && !isRenter) {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    // If the user is a renter trying to cancel an approved booking, or approve/reject
    if (isRenter && (status === "APPROVED" || status === "REJECTED" || status === "BOOKED")) {
      return res.status(403).json({ message: "Renters cannot approve, reject or book bookings" });
    }

    // If cancelling booking, delete and update room if locked
    if (status === "CANCELLED") {
      if (booking.room?._id && (booking.status === "BOOKED" || booking.room.isBooked)) {
        await Room.findByIdAndUpdate(booking.room._id, {
          isBooked: false,
          bookedBy: null,
        });
      }
      await Booking.findByIdAndDelete(booking._id);
      return res.json({ message: "Booking cancelled and removed successfully", status: "CANCELLED" });
    } 
    // If rejecting booking, delete the booking record so it automatically clears from renter's bookings and permits re-booking
    else if (status === "REJECTED") {
      await Booking.findByIdAndDelete(booking._id);
      return res.json({ message: "Booking request rejected and removed", status: "REJECTED", _id: booking._id });
    }
    // If approving booking, verify room availability but DO NOT mark isBooked until renter pays
    else if (status === "APPROVED" && booking.status !== "APPROVED" && booking.status !== "BOOKED") {
      if (booking.room?.isBooked) {
        return res.status(400).json({ message: "This room is already booked by another tenant" });
      }
      booking.status = "APPROVED";
      await booking.save();
      return res.json(booking);
    }
    // Special case for BOOKED status - happens after payment or owner authorization
    else if (status === "BOOKED" && isOwner) {
      if (booking.status === "APPROVED" || booking.status === "PENDING") {
        if (booking.room?._id) {
          await Room.findByIdAndUpdate(booking.room._id, {
            isBooked: true,
            bookedBy: booking.renter,
          });
        }
      }
      booking.status = "BOOKED";
      await booking.save();
    } else {
      booking.status = status;
      await booking.save();
    }

    // Populate the updated booking before returning
    const updatedBooking = await Booking.findById(booking._id)
      .populate("room", "title location rent bhkType imageUrl isBooked")
      .populate("renter", "name email")
      .populate("owner", "name email");

    res.json(updatedBooking || booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * REQUEST TO LEAVE / VACATE ROOM (RENTER)
 * POST /api/bookings/:id/request-leave
 */
export const requestLeaveRoom = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("room")
      .populate("owner", "name email")
      .populate("renter", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.renter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the active tenant can request to vacate this room" });
    }

    if (booking.status !== "BOOKED") {
      return res.status(400).json({ message: "Can only request to vacate currently booked properties" });
    }

    booking.status = "LEAVE_REQUESTED";
    booking.leaveRequestedAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: "Leave request sent to the landlord. Waiting for approval.",
      booking,
    });
  } catch (error) {
    console.error("Error requesting to leave room:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * APPROVE ROOM VACATION & FINANCIAL SETTLEMENT (OWNER)
 * POST /api/bookings/:id/approve-leave
 * Deducts 30% retention fee for owner wallet and refunds 70% to tenant wallet.
 */
export const approveLeaveRoom = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("room")
      .populate("owner", "name email")
      .populate("renter", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the property owner can approve vacation requests" });
    }

    if (booking.status !== "LEAVE_REQUESTED") {
      return res.status(400).json({ message: "No active leave request found for this booking" });
    }

    // Find the original payment
    const originalPayment = await (await import("../models/Payment.js")).default.findOne({
      bookingId: booking._id,
      paymentStatus: "COMPLETED",
      type: "RENT_PAYMENT"
    });

    const rentPaid = originalPayment?.amount || booking.room?.rent || 5000;
    const deductionAmount = Math.round(rentPaid * 0.30); // 30% retention for owner
    const refundAmount = Math.round(rentPaid * 0.70);    // 70% refund for tenant

    // 1. Update booking status
    booking.status = "VACATED";
    booking.leaveApprovedAt = new Date();
    booking.refundAmount = refundAmount;
    booking.deductionAmount = deductionAmount;
    booking.totalPaid = rentPaid;
    await booking.save();

    // 2. Unlock the room for new prospective tenants
    if (booking.room?._id) {
      await Room.findByIdAndUpdate(booking.room._id, {
        isBooked: false,
        bookedBy: null,
      });
    }

    const PaymentModel = (await import("../models/Payment.js")).default;

    // 3. Mark original payment as REFUNDED
    if (originalPayment) {
      originalPayment.paymentStatus = "REFUNDED";
      await originalPayment.save();
    }

    // 4. Create 70% Refund record for tenant's wallet
    const refundTxnId = `REFUND_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
    await PaymentModel.create({
      userId: booking.renter._id,
      ownerId: booking.owner._id,
      roomId: booking.room?._id || booking.room,
      bookingId: booking._id,
      amount: refundAmount,
      currency: "INR",
      paymentMethod: "WALLET_REFUND",
      paymentStatus: "COMPLETED",
      type: "REFUND",
      description: "70% Room Vacation Refund (30% Early Termination Fee Deducted)",
      transactionId: refundTxnId,
    });

    // 5. Create 30% Retention record in owner's wallet
    const retentionTxnId = `RETAIN_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
    await PaymentModel.create({
      userId: booking.renter._id,
      ownerId: booking.owner._id,
      roomId: booking.room?._id || booking.room,
      bookingId: booking._id,
      amount: deductionAmount,
      currency: "INR",
      paymentMethod: "LEASE_RETENTION",
      paymentStatus: "COMPLETED",
      type: "RETENTION_FEE",
      description: "30% Lease Termination Retention (70% Refunded to Tenant)",
      transactionId: retentionTxnId,
    });

    res.json({
      success: true,
      message: "Vacation approved. 30% retained in owner wallet, 70% refunded to tenant. Room is now available!",
      booking,
      refundAmount,
      deductionAmount,
    });
  } catch (error) {
    console.error("Error approving leave request:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * REJECT ROOM VACATION REQUEST (OWNER)
 * POST /api/bookings/:id/reject-leave
 */
export const rejectLeaveRoom = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("room")
      .populate("owner", "name email")
      .populate("renter", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the property owner can reject vacation requests" });
    }

    if (booking.status !== "LEAVE_REQUESTED") {
      return res.status(400).json({ message: "No active leave request found" });
    }

    booking.status = "BOOKED";
    booking.leaveRequestedAt = undefined;
    await booking.save();

    res.json({
      success: true,
      message: "Leave request rejected. Tenancy remains active.",
      booking,
    });
  } catch (error) {
    console.error("Error rejecting leave request:", error);
    res.status(500).json({ message: error.message });
  }
};