import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSiderbar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSiderbar);
router.get("/", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;