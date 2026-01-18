import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

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
      return res.status(400).json({ message: "Room is already booked" });
    }

    // Check if user has already booked this room AND the booking hasn't been cancelled
    const existingBooking = await Booking.findOne({
      room: roomId,
      renter: req.user._id,
      status: { $ne: "CANCELLED" }  // Only consider bookings that are not cancelled
    });

    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this room" });
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
    const bookings = await Booking.find({ renter: req.user._id })
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

    // If cancelling booking, update room status to available
    if (status === "CANCELLED") {
      // Only renters can cancel approved bookings
      if (isRenter && booking.status === "APPROVED") {
        await Room.findByIdAndUpdate(booking.room._id, {
          isBooked: false,
          bookedBy: null,
        });
      } else if (isOwner && booking.status === "PENDING") {
        // Owners can cancel pending bookings
        await Room.findByIdAndUpdate(booking.room._id, {
          isBooked: false,
          bookedBy: null,
        });
      } else if (booking.status === "CANCELLED") {
        return res.status(400).json({ message: "Booking is already cancelled" });
      } else {
        return res.status(400).json({ message: "Cannot cancel this booking" });
      }
    } 
    // If approving booking, update room status
    else if (status === "APPROVED" && booking.status !== "APPROVED" && booking.status !== "BOOKED") {
      // Make sure the room is still available before approving
      if (booking.room.isBooked) {
        return res.status(400).json({ message: "Room is already booked" });
      }
      
      await Room.findByIdAndUpdate(booking.room._id, {
        isBooked: true,
        bookedBy: booking.renter,
      });
    }
    // If rejecting booking, no change to room status is needed since it wasn't booked yet
    else if (status === "REJECTED" && booking.status === "PENDING") {
      // Just update the booking status, no change to room status
    }
    // Special case for BOOKED status - typically only happens after payment and owner approval
    else if (status === "BOOKED" && isOwner) {
      // Only owners can mark as BOOKED after APPROVED
      if (booking.status === "APPROVED") {
        await Room.findByIdAndUpdate(booking.room._id, {
          isBooked: true,
          bookedBy: booking.renter,
        });
      } else {
        return res.status(400).json({ message: "Can only mark APPROVED bookings as BOOKED" });
      }
    }

    // Update booking status
    booking.status = status;
    await booking.save();

    // Populate the updated booking before returning
    const updatedBooking = await Booking.findById(booking._id)
      .populate("room", "title location rent bhkType imageUrl isBooked")
      .populate("renter", "name email")
      .populate("owner", "name email");

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};