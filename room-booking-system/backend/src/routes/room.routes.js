import express from 'express';

import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  // we'll add later: checkRoomAvailability
} from "../controllers/room.controller.js";

// We'll create this middleware soon (for JWT admin check)
import { protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

/* ---------- ADMIN-ONLY ROUTES ---------- */
router.use(protectAdmin);           // ← All routes below are protected

router.post("/", createRoom);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

// Optional future route (we'll add soon)
// router.get("/:id/availability", checkRoomAvailability);

export default router;