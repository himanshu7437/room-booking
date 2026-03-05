import express from 'express';
import { registerAdmin, loginAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);   // ← optional – use once then comment out or remove
router.post('/login', loginAdmin);

export default router;