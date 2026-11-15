
import TeamMember from "../models/TeamMember.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary, {
  cloudinaryConfigured,
} from "../config/cloudinary.js";

// @desc    Get all team members (admin)
// @route   GET /api/team/admin/all
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find()
      .populate("createdBy", "name email")
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get team members error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch team members.",
    });
  }
};

// @desc    Get active team members (public)
// @route   GET /api/team
export const getPublicTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true })
      .select("-createdBy -__v")
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get public team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch team members.",
    });
  }
};

// @desc    Create team member
// @route   POST /api/team/admin
export const createTeamMember = async (req, res) => {
  try {
    const {
      name,
      position,
      description,
      order,
      isActive,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Team member name is required.",
      });
    }

    let image = { url: "", publicId: "" };

    if (req.file) {
      if (!cloudinaryConfigured) {
        return res.status(500).json({
          success: false,
          message: "Cloudinary is not configured.",
        });
      }

      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "zabwelfare/team"
      );

      image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    const member = await TeamMember.create({
      name,
      position: position || "Member",
      description,
      order: order === undefined ? 0 : Number(order),
      isActive: isActive === undefined ? true : isActive === "true",
      image,
      createdBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: "Team member created successfully.",
      member,
    });
  } catch (error) {
    console.error("Create team member error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A President or Vice President already exists.",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create team member.",
    });
  }
};

// @desc    Update team member
// @route   PUT /api/team/admin/:id
export const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    const {
      name,
      position,
      description,
      order,
      isActive,
    } = req.body;

    if (name !== undefined) member.name = name;
    if (position !== undefined) member.position = position;
    if (description !== undefined) member.description = description;
    if (order !== undefined) member.order = Number(order);

    if (isActive !== undefined) {
      member.isActive = isActive === true || isActive === "true";
    }

    let oldImagePublicId = null;

    if (req.file) {
      if (!cloudinaryConfigured) {
        return res.status(500).json({
          success: false,
          message: "Cloudinary is not configured.",
        });
      }

      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "zabwelfare/team"
      );

      oldImagePublicId = member.image?.publicId;

      member.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    await member.save();

    // Remove the previous image after the new member data is saved.
    if (oldImagePublicId && cloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(oldImagePublicId);
      } catch (cloudinaryError) {
        console.error("Old team image cleanup error:", cloudinaryError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Team member updated successfully.",
      member,
    });
  } catch (error) {
    console.error("Update team member error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A President or Vice President already exists.",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update team member.",
    });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/admin/:id
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    const imagePublicId = member.image?.publicId;

    await member.deleteOne();

    if (imagePublicId && cloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (cloudinaryError) {
        console.error("Team image deletion error:", cloudinaryError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully.",
    });
  } catch (error) {
    console.error("Delete team member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete team member.",
    });
  }
};
