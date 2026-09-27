const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || process.env.Cloud_Name,
    api_key: process.env.CLOUD_API_KEY || process.env.Cloud_API_Key,
    api_secret: process.env.CLOUD_API_SECRET || process.env.Cloud_API_Secret,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Nookify_Dev',
        allowedFormats: ["png", "jpg", "jpeg", "gif", "webp"],
    },
});
module.exports = { cloudinary, storage };