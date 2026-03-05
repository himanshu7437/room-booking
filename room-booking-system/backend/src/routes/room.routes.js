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
import { uploadRoomImages } from '../middleware/upload.middleware.js';

import { validate } from '../middleware/validate.middleware.js';
import { createRoomSchema, updateRoomSchema } from '../validations/schemas.js';

const router = express.Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

/* ---------- ADMIN-ONLY ROUTES ---------- */
router.use(protectAdmin);           // ← All routes below are protected

router.post('/', protectAdmin, uploadRoomImages, validate(createRoomSchema), createRoom);
router.put('/:id', protectAdmin, uploadRoomImages, validate(updateRoomSchema), updateRoom);
router.delete("/:id", deleteRoom);

export default router;