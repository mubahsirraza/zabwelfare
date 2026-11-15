
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: [true, "Donor name is required"],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [1, "Donation amount must be greater than zero"],
    },
    currency: {
      type: String,
      default: "PKR",
      enum: ["PKR"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Bank Transfer", "JazzCash", "NayaPay"],
    },
    transactionReference: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },
    paymentProof: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    message: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

donationSchema.index({ status: 1, createdAt: -1 });
donationSchema.index({ paymentMethod: 1 });
donationSchema.index({ transactionReference: 1 });

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
