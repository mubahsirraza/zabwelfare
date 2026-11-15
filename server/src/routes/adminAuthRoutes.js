
import express from "express";

import {
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
} from "../controllers/adminAuthController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protect, getAdminProfile);
router.post("/logout", protect, logoutAdmin);

export default router;
