const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/codingController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/generate', ctrl.generateProblem);
router.get('/history', ctrl.getUserCodingHistory);
router.get('/:id', ctrl.getCodingRound);
router.post('/:id/submit', ctrl.submitCode);

module.exports = router;
