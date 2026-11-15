import cloudinary, {
  cloudinaryConfigured,
} from "../config/cloudinary.js";

const uploadToCloudinary = (
  fileBuffer,
  folder = "zabwelfare"
) => {
  return new Promise((resolve, reject) => {
    if (!cloudinaryConfigured) {
      return reject(
        new Error("Cloudinary credentials are not configured.")
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default uploadToCloudinary;