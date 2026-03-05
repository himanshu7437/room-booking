import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import path from 'path'
import roomRoutes from './routes/room.routes.js'
import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import eventRoutes from './routes/event.routes.js';

const app = express();

/* ----------------- Middlewares ----------------- */

// Parse JSON requests
app.use(express.json());

// Enable CORS
app.use(cors());

// Serve static uploads (for photos/videos)
app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

/* ----------------- Health Route ----------------- */

app.get("/", (req, res) => {
  res.send("API Running");
});

/* ROUTES */
app.use("/api/rooms", roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);

// Global error handler (NEW: catches 404s/unhandled errors)
app.use((err, req, res, next) => { // NEW
  console.error(err.stack); // NEW
  res.status(500).json({ message: 'Something went wrong!' }); // NEW
});

export default app;