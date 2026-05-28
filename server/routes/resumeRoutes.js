const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');

router.use(protect);
router.post('/upload', uploadResume, ctrl.uploadResume);
router.post('/analyze', uploadResume, ctrl.analyzeResume);
router.get('/analysis', ctrl.getResumeAnalysis);

module.exports = router;
