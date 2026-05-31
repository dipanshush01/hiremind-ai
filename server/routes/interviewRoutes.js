const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/start', ctrl.startInterview);
router.get('/', ctrl.getUserInterviews);
router.get('/:id', ctrl.getInterview);
router.post('/:id/answer', ctrl.submitAnswer);
router.post('/:id/end', ctrl.endInterview);
router.post('/:id/anti-cheating', ctrl.updateAntiCheating);

module.exports = router;
