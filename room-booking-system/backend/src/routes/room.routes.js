import express from 'express';

import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";

const router = express.Router();

/* ---------- PUBLIC ROUTES ---------- */

router.get("/", getAllRooms);
router.get("/:id", getRoomById);

/* ---------- ADMIN ROUTES ---------- */

router.post("/", createRoom);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;