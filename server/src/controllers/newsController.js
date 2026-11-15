
import News from "../models/News.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary, {
  cloudinaryConfigured,
} from "../config/cloudinary.js";

// Generate URL-friendly slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Check slug uniqueness
const getUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await News.findOne(query);

    if (!existing) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// @desc Get all news (admin)
// @route GET /api/news/admin/all
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: news.length,
      news,
    });
  } catch (error) {
    console.error("Get all news error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

// @desc Get published news (public)
// @route GET /api/news
export const getPublicNews = async (req, res) => {
  try {
    const news = await News.find({ status: "Published" })
      .select("-createdBy")
      .sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: news.length,
      news,
    });
  } catch (error) {
    console.error("Get public news error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

// @desc Get featured published news
// @route GET /api/news/featured
export const getFeaturedNews = async (req, res) => {
  try {
    const news = await News.find({
      status: "Published",
      featured: true,
    })
      .select("-createdBy")
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: news.length,
      news,
    });
  } catch (error) {
    console.error("Get featured news error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured news",
    });
  }
};

// @desc Get one published article
// @route GET /api/news/:slug
export const getNewsBySlug = async (req, res) => {
  try {
    const article = await News.findOne({
      slug: req.params.slug,
      status: "Published",
    }).select("-createdBy");

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      });
    }

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("Get news article error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch news article",
    });
  }
};

// @desc Create news article
// @route POST /api/news/admin
export const createNews = async (req, res) => {
  try {
    const { title, excerpt, content, category, status, featured } = req.body;

    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt and content are required",
      });
    }

    let coverImage = { url: "", publicId: "" };

    if (req.file) {
      if (!cloudinaryConfigured) {
        return res.status(503).json({
          success: false,
          message: "Image upload is currently unavailable",
        });
      }

      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "zabwelfare/news"
      );

      coverImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    const slug = await getUniqueSlug(title);

    const normalizedStatus =
      status === "Published" ? "Published" : "Draft";

    const article = await News.create({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category?.trim() || "General",
      status: normalizedStatus,
      featured: featured === true || featured === "true",
      coverImage,
      publishedAt:
        normalizedStatus === "Published" ? new Date() : null,
      createdBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: "News article created successfully",
      article,
    });
  } catch (error) {
    console.error("Create news error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create news article",
    });
  }
};

// @desc Update news article
// @route PUT /api/news/admin/:id
export const updateNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      });
    }

    const {
      title,
      excerpt,
      content,
      category,
      status,
      featured,
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      article.title = title.trim();
      article.slug = await getUniqueSlug(title, article._id);
    }

    if (excerpt !== undefined) article.excerpt = excerpt.trim();
    if (content !== undefined) article.content = content.trim();
    if (category !== undefined) {
      article.category = category.trim() || "General";
    }

    if (status !== undefined) {
      if (!["Draft", "Published"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid news status",
        });
      }

      if (status === "Published" && article.status !== "Published") {
        article.publishedAt = new Date();
      }

      if (status === "Draft") {
        article.publishedAt = null;
      }

      article.status = status;
    }

    if (featured !== undefined) {
      article.featured = featured === true || featured === "true";
    }

    if (req.file) {
      if (!cloudinaryConfigured) {
        return res.status(503).json({
          success: false,
          message: "Image upload is currently unavailable",
        });
      }

      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "zabwelfare/news"
      );

      const oldPublicId = article.coverImage?.publicId;

      article.coverImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };

      await article.save();

      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (cleanupError) {
          console.error("Old news image cleanup error:", cleanupError);
        }
      }
    } else {
      await article.save();
    }

    res.status(200).json({
      success: true,
      message: "News article updated successfully",
      article,
    });
  } catch (error) {
    console.error("Update news error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update news article",
    });
  }
};

// @desc Delete news article
// @route DELETE /api/news/admin/:id
export const deleteNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      });
    }

    const publicId = article.coverImage?.publicId;

    await article.deleteOne();

    if (publicId && cloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cleanupError) {
        console.error("News image deletion error:", cleanupError);
      }
    }

    res.status(200).json({
      success: true,
      message: "News article deleted successfully",
    });
  } catch (error) {
    console.error("Delete news error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete news article",
    });
  }
};
