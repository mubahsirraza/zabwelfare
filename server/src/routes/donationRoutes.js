
import express from "express";
import {
  createDonation,
  getAllDonations,
  getDonationById,
  decideDonation,
  deleteDonation,
} from "../controllers/donationController.js";
import protect, { authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public: submit a donation with optional payment proof
router.post("/", upload.single("paymentProof"), createDonation);

// Admin: view all donations
router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAllDonations
);

// Admin: view one donation
router.get(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  getDonationById
);

// Admin: verify or reject a pending donation
router.patch(
  "/admin/:id/decision",
  protect,
  authorize("super_admin", "admin"),
  decideDonation
);

// Admin: delete a donation
router.delete(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  deleteDonation
);

export default router;
