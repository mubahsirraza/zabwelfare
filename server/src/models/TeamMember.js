
import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team member name is required"],
      trim: true,
      maxlength: 100,
    },

    position: {
      type: String,
      enum: ["President", "Vice President", "Member"],
      required: [true, "Please select a team position"],
      default: "Member",
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

// Keep leadership positions unique.
teamMemberSchema.index(
  { position: 1 },
  {
    unique: true,
    partialFilterExpression: {
      position: { $in: ["President", "Vice President"] },
    },
  }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;
