import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;
    // upload to cloudinary
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    // file has successfully uploaded
    console.log("File has successfully uploaded ", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localPath); // remove the locaaly saved temporal file as the upload got failed
    return null;
  }
};

export { uploadOnCloudinary };
