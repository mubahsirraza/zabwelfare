
import express from "express";

import {
  getAllGallery,
  getPublicGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../controllers/galleryController.js";

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
  getAllGallery
);

router.post(
  "/admin",
  protect,
  authorize("super_admin", "admin"),
  upload.single("image"),
  createGallery
);

router.put(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  upload.single("image"),
  updateGallery
);

router.delete(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  deleteGallery
);

// ==========================================
// PUBLIC WEBSITE ROUTE
// ==========================================

router.get("/", getPublicGallery);

export default router;
