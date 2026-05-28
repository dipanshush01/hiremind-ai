const pdf = require('pdf-parse');
const fs = require('fs');
const User = require('../models/User');
const cloudinaryService = require('../services/cloudinaryService');
const aiService = require('../services/aiService');
const logger = require('../utils/logger');

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
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);
    const resumeText = pdfData.text;
    const analysis = await aiService.extractSkillsFromResume(resumeText);
    // Update user skills
    if (analysis.technicalSkills?.length > 0) {
      await User.findByIdAndUpdate(req.user.id, { skills: analysis.technicalSkills });
    }
    // Upload to cloudinary
    const { url, publicId } = await cloudinaryService.uploadResume(req.file.path, req.user.id);
    await User.findByIdAndUpdate(req.user.id, { resumeUrl: url, resumePublicId: publicId });
    res.status(200).json({ success: true, analysis, resumeUrl: url });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
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
