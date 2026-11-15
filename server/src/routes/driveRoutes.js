
import express from "express";

import {
  getAllDrives,
  getPublishedDrives,
  getDriveBySlug,
  createDrive,
  updateDrive,
  deleteDrive,
} from "../controllers/driveController.js";

import protect, {
  authorize,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================

router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAllDrives
);

router.post(
  "/admin",
  protect,
  authorize("super_admin", "admin"),
  upload.single("coverImage"),
  createDrive
);

router.put(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  upload.single("coverImage"),
  updateDrive
);

router.delete(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  deleteDrive
);

// ==========================================
// PUBLIC WEBSITE ROUTES
// ==========================================

router.get("/", getPublishedDrives);

router.get("/:slug", getDriveBySlug);

export default router;
