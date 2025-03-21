import express from "express";
import dontenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dontenv.config();

const { NODE_ENV, PORT } = process.env;

const FRONTEND_URL = process.env.VITE_API_URL;
console.log(FRONTEND_URL);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (NODE_ENV === "development") {
  server.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    connectDB();
  });
} else if (NODE_ENV === "production") {
  // For production, Vercel expects an exported server (or app)
  connectDB();
}

export default server;
