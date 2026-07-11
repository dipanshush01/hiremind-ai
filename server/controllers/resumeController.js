const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const cloudinaryService = require('../services/cloudinaryService');
const aiService = require('../services/aiService');
const logger = require('../utils/logger');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const { url, publicId } = await cloudinaryService.uploadResume(req.file.path, req.user.id);
    await User.findByIdAndUpdate(req.user.id, { resumeUrl: url, resumePublicId: publicId });
    res.status(200).json({ success: true, resumeUrl: url });
  } catch (error) {
    next(error);
  }
};

exports.analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    // Ensure file exists before reading
    if (!fs.existsSync(req.file.path)) {
      return res.status(400).json({ success: false, message: 'File upload failed' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    let resumeText = '';

    try {
      const pdfData = await pdf(dataBuffer);
      resumeText = pdfData.text;
    } catch (pdfErr) {
      resumeText = 'Could not extract text from PDF';
    }

    const analysis = await aiService.extractSkillsFromResume(resumeText);

    if (analysis.technicalSkills?.length > 0) {
      await User.findByIdAndUpdate(req.user.id, { skills: analysis.technicalSkills });
    }

    let resumeUrl = '';
    let publicId = '';

    try {
  const uploaded = await cloudinaryService.uploadResume(req.file.path, req.user.id);
  resumeUrl = uploaded.url;
  publicId = uploaded.publicId;
  await User.findByIdAndUpdate(req.user.id, { resumeUrl, resumePublicId: publicId });
} catch (uploadErr) {
  logger.error('Cloudinary upload failed - continuing without upload:', uploadErr.message);
  resumeUrl = 'uploaded';
  if (req.file?.path && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }
}

    res.status(200).json({ success: true, analysis, resumeUrl });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

exports.getResumeAnalysis = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.resumeUrl) return res.status(404).json({ success: false, message: 'No resume uploaded yet' });
    res.status(200).json({ success: true, resumeUrl: user.resumeUrl, skills: user.skills });
  } catch (error) {
    next(error);
  }
};
