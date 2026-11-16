
import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: 30,
    },
    areaOfInterest: {
      type: String,
      required: [true, "Area of interest is required"],
      enum: [
        "Education",
        "Community Welfare",
        "Food Support",
        "Event Management",
        "Media and Communications",
        "Other",
      ],
    },
    motivation: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

volunteerSchema.index({ status: 1, createdAt: -1 });
volunteerSchema.index({ email: 1 });

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

export default Volunteer;
