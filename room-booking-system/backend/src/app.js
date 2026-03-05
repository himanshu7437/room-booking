import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import roomRoutes from './routes/room.routes.js'

const app = express();

/* ----------------- Middlewares ----------------- */

// Parse JSON requests
app.use(express.json());

// Enable CORS
app.use(cors());

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

export default app;