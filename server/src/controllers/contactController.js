
import mongoose from "mongoose";
import Contact from "../models/Contact.js";

// Public: submit a contact message
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please complete all contact form fields.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (
      name.trim().length > 100 ||
      normalizedEmail.length > 150 ||
      subject.trim().length > 150 ||
      message.trim().length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: normalizedEmail,
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      contact: {
        _id: contact._id,
        name: contact.name,
        status: contact.status,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error("Create contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message. Please try again.",
    });
  }
};

// Admin: get all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Get contact messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact messages.",
    });
  }
};

// Admin: get one contact message
export const getContactById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    const contact = await Contact.findById(req.params.id)
      .populate("reviewedBy", "name email")
      .select("-__v");

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Get contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch this contact message.",
    });
  }
};

// Admin: update message status
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    if (!["New", "Read", "Resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be New, Read, or Resolved.",
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    contact.status = status;
    contact.reviewedBy = req.admin?._id || req.user?._id || null;
    contact.reviewedAt = new Date();

    await contact.save();

    return res.status(200).json({
      success: true,
      message: `Contact message marked as ${status.toLowerCase()}.`,
      contact,
    });
  } catch (error) {
    console.error("Update contact status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update the contact message.",
    });
  }
};

// Admin: delete a contact message
export const deleteContact = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete this contact message.",
    });
  }
};
