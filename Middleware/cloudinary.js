const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.cloudinaryAPIKEY,
  api_secret: process.env.cloudinaryAPISECRET,
});

module.exports =cloudinary;