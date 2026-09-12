import Room from "../models/Room.js";

/**
 * CREATE ROOM
 */
export const createRoom = async (req, res) => {
  try {
    const { title, bhkType, rent, location, description, imageUrl } = req.body;

    // Validate required fields
    if (!title || !bhkType || !rent || !location) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Create room with owner from authenticated user
    const room = await Room.create({
      title,
      bhkType,
      rent,
      location,
      description,
      imageUrl,
      owner: req.user._id, // ✅ Fix: Explicitly set owner field
    });

    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Server error while creating room" });
  }
};

/**
 * GET ALL ROOMS
 */
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('owner', 'name email avatar').sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE ROOM
 */
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('owner', 'name email avatar');
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE ROOM
 */
export const updateRoom = async (req, res) => {
  try {
    // First, find the room to check ownership
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the room belongs to the authenticated user
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this room" });
    }

    // Update the room with the new data
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE ROOM
 */
export const deleteRoom = async (req, res) => {
  try {
    // First, find the room to check ownership
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the room belongs to the authenticated user
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this room" });
    }

    // Delete the room if owned by the user
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// OWNER → Get My Rooms
export const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user._id }).populate('owner', 'name email');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};