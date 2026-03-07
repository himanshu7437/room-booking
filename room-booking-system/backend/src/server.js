import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/* ---------- Allowed Origins ---------- */

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://luxstay-sand.vercel.app"]
    : ["http://localhost:5173"];

/* ---------- Create HTTP Server ---------- */

const server = http.createServer(app);

/* ---------- Setup Socket.io ---------- */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* ---------- Socket Connection ---------- */

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ---------- Make io accessible in controllers ---------- */

app.set("io", io);

/* ---------- Start Server ---------- */

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();