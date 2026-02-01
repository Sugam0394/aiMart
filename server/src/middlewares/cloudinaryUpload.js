 import{ v2 as cloudinary }from 'cloudinary'
 import fs from 'fs'


 const uploadToCloudinary = async(localFilePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

 if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("❌ Cloudinary ENV not loaded");
  }

    const result = await cloudinary.uploader.upload(localFilePath, {
    folder: "ai-mart/profiles",
  });


 fs.unlinkSync(localFilePath);
  return result.secure_url;

 }

 export default uploadToCloudinary


 