import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";
import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

//Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

//Initialize Socket.IO
export const io = new Server(server, {
  cors: { origin: "*" },
});

//Store online users
export const userSocketMap = {}; //userId -> socketId

//Socket.IO connection handling
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id; // Map userId to socketId when a new client connects
  }
  console.log("User Connected:", userId);

  //Emit online users to all clients whenever a new client connects
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated online users list when a client disconnects
  });
});

//Middleware setup
app.use(cors());
app.use(express.json({ limit: "4mb" }));

//Routes setup
app.use("/api/status", (req, res) => {
  res.send({ message: "Server is running!" });
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//Connect to the database
await connectDB();

//Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
