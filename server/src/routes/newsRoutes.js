
import express from "express";

import {
  getAllNews,
  getPublicNews,
  getFeaturedNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";

import protect, {
  authorize,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ==========================================
// ADMIN ROUTES
// Keep these before /:slug
// ==========================================

router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAllNews
);

router.post(
  "/admin",
  protect,
  authorize("super_admin", "admin"),
  upload.single("coverImage"),
  createNews
);

router.put(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  upload.single("coverImage"),
  updateNews
);

router.delete(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  deleteNews
);

// ==========================================
// PUBLIC ROUTES
// ==========================================

router.get("/featured", getFeaturedNews);
router.get("/", getPublicNews);
router.get("/:slug", getNewsBySlug);

export default router;
