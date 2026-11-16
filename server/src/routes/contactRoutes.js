
import express from "express";

import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";

import protect, {
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: submit a message
router.post("/", createContact);

// Admin: view all messages
router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAllContacts
);

// Admin: view one message
router.get(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  getContactById
);

// Admin: update message status
router.patch(
  "/admin/:id/status",
  protect,
  authorize("super_admin", "admin"),
  updateContactStatus
);

// Admin: delete a message
router.delete(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin"),
  deleteContact
);

export default router;
