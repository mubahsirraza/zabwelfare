
import Drive from "../models/Drive.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary, {
  cloudinaryConfigured,
} from "../config/cloudinary.js";

// Helper: Normalize drive slug
const normalizeSlug = (slug = "") => {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Helper: Delete Cloudinary image safely
const deleteCloudinaryImage = async (publicId) => {
  if (!publicId || !cloudinaryConfigured) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary image deletion failed:", error.message);
  }
};

// @desc    Get all drives (admin)
// @route   GET /api/drives/admin/all
export const getAllDrives = async (req, res) => {
  try {
    const drives = await Drive.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      drives,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve drives.",
      error: error.message,
    });
  }
};

// @desc    Get published drives
// @route   GET /api/drives
export const getPublishedDrives = async (req, res) => {
  try {
    const drives = await Drive.find({
      status: { $in: ["published", "completed"] },
    }).sort({ driveDate: -1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      drives,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve published drives.",
      error: error.message,
    });
  }
};

// @desc    Get single published drive
// @route   GET /api/drives/:slug
export const getDriveBySlug = async (req, res) => {
  try {
    const drive = await Drive.findOne({
      slug: req.params.slug,
      status: { $in: ["published", "completed"] },
    });

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found.",
      });
    }

    res.status(200).json({
      success: true,
      drive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve drive.",
      error: error.message,
    });
  }
};

// @desc    Create drive
// @route   POST /api/drives/admin
export const createDrive = async (req, res) => {
  let uploadedImage = null;

  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      category,
      location,
      driveDate,
      status,
      featured,
    } = req.body;

    if (
      !title?.trim() ||
      !slug?.trim() ||
      !shortDescription?.trim() ||
      !description?.trim() ||
      !driveDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required drive fields.",
      });
    }

    const normalizedSlug = normalizeSlug(slug);

    if (!normalizedSlug) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid drive slug.",
      });
    }

    const existingDrive = await Drive.findOne({
      slug: normalizedSlug,
    });

    if (existingDrive) {
      return res.status(409).json({
        success: false,
        message: "A drive with this slug already exists.",
      });
    }

    // Upload cover image if provided
    if (req.file) {
      uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "zabwelfare/drives"
      );
    }

    const drive = await Drive.create({
      title: title.trim(),
      slug: normalizedSlug,
      shortDescription: shortDescription.trim(),
      description,
      category,
      location,
      driveDate,
      status,
      featured,
      coverImage: uploadedImage
        ? {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
          }
        : undefined,
      createdBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: "Drive created successfully.",
      drive,
    });
  } catch (error) {
    // Remove uploaded image if database creation fails
    if (uploadedImage?.public_id) {
      await deleteCloudinaryImage(uploadedImage.public_id);
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A drive with this slug already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to create drive.",
      error: error.message,
    });
  }
};

// @desc    Update drive
// @route   PUT /api/drives/admin/:id
export const updateDrive = async (req, res) => {
  let uploadedImage = null;

  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found.",
      });
    }

    const oldImagePublicId = drive.coverImage?.publicId;

    const allowedFields = [
      "title",
      "slug",
      "shortDescription",
      "description",
      "category",
      "location",
      "driveDate",
      "status",
      "featured",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        drive[field] = req.body[field];
      }
    });

    if (req.body.slug !== undefined) {
      const normalizedSlug = normalizeSlug(req.body.slug);

      if (!normalizedSlug) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid drive slug.",
        });
      }

      drive.slug = normalizedSlug;
    }

    // Upload replacement image if provided
    if (req.file) {
      uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "zabwelfare/drives"
      );

      drive.coverImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    await drive.save();

    // Delete old image only after successful database update
    if (
      uploadedImage &&
      oldImagePublicId &&
      oldImagePublicId !== uploadedImage.public_id
    ) {
      await deleteCloudinaryImage(oldImagePublicId);
    }

    res.status(200).json({
      success: true,
      message: "Drive updated successfully.",
      drive,
    });
  } catch (error) {
    // Clean up newly uploaded image if update fails
    if (uploadedImage?.public_id) {
      await deleteCloudinaryImage(uploadedImage.public_id);
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A drive with this slug already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to update drive.",
      error: error.message,
    });
  }
};

// @desc    Delete drive
// @route   DELETE /api/drives/admin/:id
export const deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found.",
      });
    }

    const imagePublicId = drive.coverImage?.publicId;

    await drive.deleteOne();

    // Delete image after successful database deletion
    await deleteCloudinaryImage(imagePublicId);

    res.status(200).json({
      success: true,
      message: "Drive deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete drive.",
      error: error.message,
    });
  }
};
