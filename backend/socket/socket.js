import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// {userId: socketId}
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Live messages
  socket.on("sendMessage", (msg) => {
    const receiverSocket = getReceiverSocketId(msg.receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("receiveMessage", msg);
  });

  // Live delete
  socket.on("deleteMessage", (msgId, receiverId) => {
    const receiverSocket = getReceiverSocketId(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("messageDeleted", msgId);
  });

  // Live update
  socket.on("updateMessage", (msg, receiverId) => {
    const receiverSocket = getReceiverSocketId(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("messageUpdated", msg);
  });
});

export { io, app, server };
