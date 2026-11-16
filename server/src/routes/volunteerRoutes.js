import express from "express";

import {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  decideVolunteer,
  deleteVolunteer,
} from "../controllers/volunteerController.js";

import protect, {
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: submit a volunteer application
router.post("/", createVolunteer);

// Admin: view all applications
router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAllVolunteers
);

// Admin: view one application
router.get(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  getVolunteerById
);

// Admin: approve or reject an application
router.patch(
  "/admin/:id/decision",
  protect,
  authorize("super_admin", "admin"),
  decideVolunteer
);

// Admin: delete an application
router.delete(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  deleteVolunteer
);

export default router;