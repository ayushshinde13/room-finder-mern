import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { 
  getAllRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  deleteRoom,
  getMyRooms // Renaming to getOwnerRooms would be better but keeping consistent for now
} from "../controllers/roomController.js";

const router = express.Router();

// GET /api/rooms - Get all rooms (public access)
router.get("/", getAllRooms);

// PROTECTED ROUTES
router.use(protect); // Apply protect middleware to all routes below

// Define specific routes before dynamic routes to avoid conflicts
// GET /api/rooms/owner - Get rooms created by the authenticated user (owners only)
router.get("/owner", getMyRooms);

// POST /api/rooms - Create a new room (owners only)
router.post("/", authorizeRoles("OWNER"), createRoom);

// PUT /api/rooms/:id - Update a room (owners only)
router.put("/:id", authorizeRoles("OWNER"), updateRoom);

// DELETE /api/rooms/:id - Delete a room (owners only)
router.delete("/:id", authorizeRoles("OWNER"), deleteRoom);

// GET /api/rooms/:id - Get room by ID (public access) - MUST BE LAST
router.get("/:id", getRoomById);

export default router;