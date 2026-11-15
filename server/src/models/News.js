
import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "News title is required"],
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: [true, "News slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: [true, "News excerpt is required"],
      trim: true,
      maxlength: 500,
    },

    content: {
      type: String,
      required: [true, "News content is required"],
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

    category: {
      type: String,
      trim: true,
      default: "General",
      maxlength: 80,
    },

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ featured: 1, status: 1 });

const News = mongoose.model("News", newsSchema);

export default News;
