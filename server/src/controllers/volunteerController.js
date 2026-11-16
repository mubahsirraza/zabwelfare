import mongoose from "mongoose";
import Volunteer from "../models/Volunteer.js";

// Submit a volunteer application (public)
export const createVolunteer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      areaOfInterest,
      motivation,
    } = req.body;

    if (!fullName || !email || !phone || !areaOfInterest) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, phone, and area of interest.",
      });
    }

    const volunteer = await Volunteer.create({
      fullName,
      email: email.trim().toLowerCase(),
      phone,
      areaOfInterest,
      motivation: motivation || "",
    });

    return res.status(201).json({
      success: true,
      message: "Your volunteer application has been submitted successfully.",
      application: {
        _id: volunteer._id,
        fullName: volunteer.fullName,
        status: volunteer.status,
      },
    });
  } catch (error) {
    console.error("Create volunteer application error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your application. Please try again.",
    });
  }
};

// Get all volunteer applications (admin)
export const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers,
    });
  } catch (error) {
    console.error("Get volunteers error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch volunteer applications.",
    });
  }
};

// Get one volunteer application (admin)
export const getVolunteerById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const volunteer = await Volunteer.findById(req.params.id)
      .populate("reviewedBy", "name email")
      .select("-__v");

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      volunteer,
    });
  } catch (error) {
    console.error("Get volunteer error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch the volunteer application.",
    });
  }
};

// Approve or reject an application (admin)
export const decideVolunteer = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be Approved or Rejected.",
      });
    }

    if (status === "Rejected" && !adminNotes?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a reason for rejecting this application.",
      });
    }

    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer application not found.",
      });
    }

    if (volunteer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This application has already been reviewed.",
      });
    }

    volunteer.status = status;
    volunteer.adminNotes = adminNotes?.trim() || "";
    volunteer.reviewedBy = req.admin?._id || req.user?._id || null;
    volunteer.reviewedAt = new Date();

    await volunteer.save();

    return res.status(200).json({
      success: true,
      message: `Volunteer application ${status.toLowerCase()} successfully.`,
      volunteer,
    });
  } catch (error) {
    console.error("Decide volunteer application error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to review this application.",
    });
  }
};

// Delete an application (admin)
export const deleteVolunteer = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Volunteer application deleted successfully.",
    });
  } catch (error) {
    console.error("Delete volunteer application error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete this application.",
    });
  }
};