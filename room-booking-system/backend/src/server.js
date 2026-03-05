import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/* ---------- Connect Database ---------- */
connectDB();

/* ---------- Create HTTP Server ---------- */
const server = http.createServer(app);

/* ---------- Setup Socket.io ---------- */
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ---------- Socket Connection ---------- */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

/* ---------- Start Server ---------- */
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});