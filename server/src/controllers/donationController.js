
import Donation from "../models/Donation.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary, {
  cloudinaryConfigured,
} from "../config/cloudinary.js";

// ======================================================
// PUBLIC: SUBMIT A DONATION
// POST /api/donations
// ======================================================

export const createDonation = async (req, res) => {
  try {
    const {
      donorName,
      email,
      phone,
      amount,
      paymentMethod,
      transactionReference,
      message,
      isAnonymous,
    } = req.body;

    if (
      !donorName?.trim() ||
      !phone?.trim() ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required donation details.",
      });
    }

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid donation amount.",
      });
    }

    const allowedMethods = [
      "Bank Transfer",
      "JazzCash",
      "NayaPay",
    ];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    let paymentProof = {
      url: "",
      publicId: "",
    };

    if (req.file) {
      if (!cloudinaryConfigured) {
        return res.status(503).json({
          success: false,
          message: "Payment proof uploads are currently unavailable.",
        });
      }

      const uploadedFile = await uploadToCloudinary(
        req.file.buffer,
        "zabwelfare/donations"
      );

      paymentProof = {
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
      };
    }

    const donation = await Donation.create({
      donorName: donorName.trim(),
      email: email?.trim() || "",
      phone: phone.trim(),
      amount: parsedAmount,
      currency: "PKR",
      paymentMethod,
      transactionReference: transactionReference?.trim() || "",
      paymentProof,
      message: message?.trim() || "",
      isAnonymous: isAnonymous === true || isAnonymous === "true",
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Your donation submission has been received.",
      donation: {
        _id: donation._id,
        amount: donation.amount,
        currency: donation.currency,
        paymentMethod: donation.paymentMethod,
        status: donation.status,
        createdAt: donation.createdAt,
      },
    });
  } catch (error) {
    console.error("Create donation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your donation.",
    });
  }
};

// ======================================================
// ADMIN: GET ALL DONATIONS
// GET /api/donations/admin/all
// ======================================================

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("verifiedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("Get donations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch donations.",
    });
  }
};

// ======================================================
// ADMIN: GET SINGLE DONATION
// GET /api/donations/admin/:id
// ======================================================

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("verifiedBy", "name email");

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      donation,
    });
  } catch (error) {
    console.error("Get donation details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch donation details.",
    });
  }
};

// ======================================================
// ADMIN: VERIFY OR REJECT DONATION
// PATCH /api/donations/admin/:id/decision
// ======================================================

export const decideDonation = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be Verified or Rejected.",
      });
    }

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found.",
      });
    }

    if (donation.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending donations can be reviewed.",
      });
    }

    if (status === "Rejected" && !adminNotes?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a reason for rejecting this donation.",
      });
    }

    donation.status = status;
    donation.adminNotes = adminNotes?.trim() || "";

    if (status === "Verified") {
      donation.verifiedBy = req.admin?._id || req.user?._id || null;
      donation.verifiedAt = new Date();
    }

    await donation.save();

    return res.status(200).json({
      success: true,
      message: `Donation ${status.toLowerCase()} successfully.`,
      donation,
    });
  } catch (error) {
    console.error("Donation decision error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update donation status.",
    });
  }
};

// ======================================================
// ADMIN: DELETE DONATION
// DELETE /api/donations/admin/:id
// ======================================================

export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found.",
      });
    }

    if (donation.paymentProof?.publicId && cloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(
          donation.paymentProof.publicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Payment proof deletion error:",
          cloudinaryError
        );
      }
    }

    await donation.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Donation deleted successfully.",
    });
  } catch (error) {
    console.error("Delete donation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete donation.",
    });
  }
};
