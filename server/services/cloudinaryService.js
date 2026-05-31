const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const logger = require('../utils/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadResume = async (filePath, userId) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `hiremind/resumes/${userId}`,
      resource_type: 'raw',
      public_id: `resume_${Date.now()}`,
      overwrite: true,
    });
    fs.unlinkSync(filePath);
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    logger.error('Cloudinary resume upload error:', error);
    throw new Error('Failed to upload resume');
  }
};

exports.uploadAvatar = async (filePath, userId) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `hiremind/avatars`,
      public_id: `avatar_${userId}`,
      overwrite: true,
      transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
    });
    fs.unlinkSync(filePath);
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    logger.error('Cloudinary avatar upload error:', error);
    throw new Error('Failed to upload avatar');
  }
};

exports.deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
  }
};
