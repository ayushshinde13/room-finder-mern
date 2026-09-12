import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "BOOKED", "LEAVE_REQUESTED", "VACATED"],
      default: "PENDING",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    leaveRequestedAt: {
      type: Date,
    },
    leaveApprovedAt: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    deductionAmount: {
      type: Number,
      default: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);