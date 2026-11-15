
import mongoose from "mongoose";

const driveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Drive title is required."],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required."],
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      required: [true, "Drive description is required."],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Education",
        "Food",
        "Healthcare",
        "Fundraising",
        "Environment",
        "Community Support",
        "Other",
      ],
      default: "Other",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    driveDate: {
      type: Date,
      required: true,
    },

    coverImage: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["draft", "published", "completed"],
      default: "draft",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

driveSchema.index({ status: 1, driveDate: -1 });
driveSchema.index({ featured: 1 });

const Drive = mongoose.model("Drive", driveSchema);

export default Drive;
