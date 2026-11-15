
import Gallery from "../models/Gallery.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary, {
  cloudinaryConfigured,
} from "../config/cloudinary.js";

// @desc    Get all gallery images (admin)
// @route   GET /api/gallery/admin/all
export const getAllGallery = async (req, res) => {
  try {
    const images = await Gallery.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error("Get gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve gallery images.",
      error: error.message,
    });
  }
};

// @desc    Get public gallery images
// @route   GET /api/gallery
export const getPublicGallery = async (req, res) => {
  try {
    const images = await Gallery.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error("Public gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve gallery images.",
      error: error.message,
    });
  }
};

// @desc    Upload a gallery image
// @route   POST /api/gallery/admin
export const createGallery = async (req, res) => {
  let uploadedImage = null;

  try {
    const { title, description, category, eventDate, featured } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Gallery title is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image to upload.",
      });
    }

    uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "zabwelfare/gallery"
    );

    const image = await Gallery.create({
      title: title.trim(),
      description,
      category,
      eventDate: eventDate || null,
      featured: featured === "true",
      image: {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      },
      createdBy: req.admin._id,
    });

    return res.status(201).json({
      success: true,
      message: "Gallery image uploaded successfully.",
      image,
    });
  } catch (error) {
    // Remove uploaded image if database creation fails
    if (uploadedImage?.public_id && cloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup error:", cleanupError);
      }
    }

    console.error("Create gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload gallery image.",
      error: error.message,
    });
  }
};

// @desc    Update a gallery image
// @route   PUT /api/gallery/admin/:id
export const updateGallery = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    const { title, description, category, eventDate, featured } = req.body;

    if (title !== undefined) galleryImage.title = title.trim();
    if (description !== undefined) galleryImage.description = description;
    if (category !== undefined) galleryImage.category = category;
    if (eventDate !== undefined) galleryImage.eventDate = eventDate || null;

    if (featured !== undefined) {
      galleryImage.featured = featured === true || featured === "true";
    }

    let newUpload = null;

    if (req.file) {
      newUpload = await uploadToCloudinary(
        req.file.buffer,
        "zabwelfare/gallery"
      );

      const oldPublicId = galleryImage.image?.publicId;

      galleryImage.image = {
        url: newUpload.secure_url,
        publicId: newUpload.public_id,
      };

      await galleryImage.save();

      // Delete old image only after the new image is saved
      if (oldPublicId && cloudinaryConfigured) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (deleteError) {
          console.error("Old gallery image deletion error:", deleteError);
        }
      }
    } else {
      await galleryImage.save();
    }

    return res.status(200).json({
      success: true,
      message: "Gallery image updated successfully.",
      image: galleryImage,
    });
  } catch (error) {
    console.error("Update gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update gallery image.",
      error: error.message,
    });
  }
};

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/admin/:id
export const deleteGallery = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    const publicId = galleryImage.image?.publicId;

    await galleryImage.deleteOne();

    if (publicId && cloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error("Cloudinary deletion error:", deleteError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully.",
    });
  } catch (error) {
    console.error("Delete gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete gallery image.",
      error: error.message,
    });
  }
};
