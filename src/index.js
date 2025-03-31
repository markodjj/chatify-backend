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

console.log(NODE_ENV);

const FRONTEND_URL = process.env.VITE_API_URL;
console.log("origin front ul = ", FRONTEND_URL);

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

app.use(cors(corsOptions));

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
