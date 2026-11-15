
import express from "express";

import {
  getAllTeamMembers,
  getPublicTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamController.js";

import protect, {
  authorize,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Admin routes
router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAllTeamMembers
);

router.post(
  "/admin",
  protect,
  authorize("super_admin", "admin"),
  upload.single("image"),
  createTeamMember
);

router.put(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  upload.single("image"),
  updateTeamMember
);

router.delete(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  deleteTeamMember
);

// Public route
router.get("/", getPublicTeamMembers);

export default router;
