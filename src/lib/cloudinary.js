import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL.
 * Uses resource_type: "auto" to support both images and PDFs.
 */
export async function uploadToCloudinary(file, folderName = "student_portal") {
  // If no file was uploaded, or it's empty, return null
  if (!file || typeof file === "string" || file.size === 0) {
    return null;
  }

  // Convert the Web File object to a Node.js Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: folderName,
        resource_type: "auto" // Crucial: allows PDFs and Images
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Push the buffer into the stream
    uploadStream.end(buffer);
  });
}