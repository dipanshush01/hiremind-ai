const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/me', ctrl.getUserAnalytics);
router.get('/report', ctrl.getDetailedReport);
router.get('/admin', authorize('admin'), ctrl.getAdminAnalytics);

module.exports = router;
