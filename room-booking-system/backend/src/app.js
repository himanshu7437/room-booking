import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import roomRoutes from "./routes/room.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import eventRoutes from "./routes/event.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";

const app = express();

/* ----------------- Middlewares ----------------- */

// Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = [
  "https://luxstay-sand.vercel.app",
  "https://room-booking-ivory.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Basic rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000,
  max: 500,
});

app.use(limiter);

/* ----------------- Health Route ----------------- */
app.get("/", (req, res) => {
  res.send("API Running");
});

/* ROUTES */
app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Global error handler (NEW: catches 404s/unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);

  // multer-specific errors
  if (err.name === "MulterError") {
    return res.status(400).json({ success: false, message: err.message });
  }

  // generic
  const message =
    process.env.NODE_ENV === "development"
      ? err.message || "Something went wrong!"
      : "Something went wrong!";

  res.status(500).json({ success: false, message }); // NEW
});

export default app;
