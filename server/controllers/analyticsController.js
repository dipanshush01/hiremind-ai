const Analytics = require('../models/Analytics');
const Interview = require('../models/Interview');
const CodingRound = require('../models/CodingRound');

exports.getUserAnalytics = async (req, res, next) => {
  try {
    let analytics = await Analytics.findOne({ userId: req.user.id });
    if (!analytics) analytics = await Analytics.create({ userId: req.user.id });

    // Get recent interviews for chart data
    const recentInterviews = await Interview.find({ userId: req.user.id, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('domain percentageScore createdAt duration');

    const domainStats = {};
    recentInterviews.forEach(i => {
      if (!domainStats[i.domain]) domainStats[i.domain] = { total: 0, count: 0 };
      domainStats[i.domain].total += i.percentageScore;
      domainStats[i.domain].count++;
    });

    const domainPerformance = Object.entries(domainStats).map(([domain, stats]) => ({
      domain, averageScore: Math.round(stats.total / stats.count), attempts: stats.count
    }));

    res.status(200).json({
      success: true,
      analytics,
      recentInterviews,
      domainPerformance,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDetailedReport = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(5);
    const analytics = await Analytics.findOne({ userId: req.user.id });
    res.status(200).json({ success: true, interviews, analytics });
  } catch (error) {
    next(error);
  }
};

// Admin analytics
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await require('../models/User').countDocuments({ role: 'user' });
    const totalInterviews = await Interview.countDocuments();
    const completedInterviews = await Interview.countDocuments({ status: 'completed' });
    const avgScore = await Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$percentageScore' } } }
    ]);
    const interviewsByDomain = await Interview.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 10 }
    ]);
    const recentUsers = await require('../models/User').find().sort({ createdAt: -1 }).limit(5).select('name email createdAt totalInterviews');
    res.status(200).json({
      success: true,
      stats: { totalUsers, totalInterviews, completedInterviews, averageScore: Math.round(avgScore[0]?.avg || 0) },
      interviewsByDomain,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};
