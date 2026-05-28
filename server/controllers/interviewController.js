const Interview = require('../models/Interview');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const aiService = require('../services/aiService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

exports.startInterview = async (req, res, next) => {
  try {
    const { domain, jobRole, difficulty } = req.body;
    const user = await User.findById(req.user.id);
    const questions = await aiService.generateInterviewQuestions({
      domain, jobRole, difficulty,
      skills: user.skills || [],
      count: 8,
    });
    const interview = await Interview.create({
      userId: req.user.id,
      domain, jobRole, difficulty,
      questions,
      status: 'in-progress',
      startedAt: new Date(),
      maxScore: questions.length * 10,
    });
    res.status(201).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

exports.getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (interview.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

exports.submitAnswer = async (req, res, next) => {
  try {
    const { questionId, answerText, timeSpent } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (interview.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    const question = interview.questions.find(q => q._id.toString() === questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    const analysis = await aiService.analyzeAnswer({
      questionText: question.questionText,
      answerText,
      expectedAnswer: question.expectedAnswer,
      domain: interview.domain,
    });
    const answerData = {
      questionId,
      questionText: question.questionText,
      answerText,
      timeSpent,
      score: analysis.score,
      feedback: analysis.feedback,
      aiAnalysis: {
        confidence: analysis.confidence,
        clarity: analysis.clarity,
        technicalAccuracy: analysis.technicalAccuracy,
        grammarScore: analysis.grammarScore,
        keywordsMatched: analysis.keywordsMatched,
      },
    };
    interview.answers.push(answerData);
    await interview.save();
    res.status(200).json({ success: true, analysis: answerData });
  } catch (error) {
    next(error);
  }
};

exports.endInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (interview.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const totalScore = interview.answers.reduce((sum, a) => sum + (a.score || 0), 0);
    const percentageScore = Math.round((totalScore / interview.maxScore) * 100);
    const duration = Math.round((Date.now() - new Date(interview.startedAt)) / 1000 / 60);

    const feedbackData = await aiService.generateOverallFeedback({
      domain: interview.domain,
      jobRole: interview.jobRole,
      answers: interview.answers,
      totalScore: percentageScore,
    });

    interview.totalScore = totalScore;
    interview.percentageScore = percentageScore;
    interview.duration = duration;
    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.overallFeedback = feedbackData.overallFeedback;
    interview.strengths = feedbackData.strengths || [];
    interview.improvements = feedbackData.improvements || [];
    await interview.save();

    // Update user analytics
    const analytics = await Analytics.findOneAndUpdate(
      { userId: req.user.id },
      {
        $inc: { totalInterviews: 1, completedInterviews: 1 },
        $set: { lastInterviewDate: new Date() },
      },
      { new: true, upsert: true }
    );

    // Recalculate average score
    const allInterviews = await Interview.find({ userId: req.user.id, status: 'completed' });
    const avgScore = allInterviews.reduce((s, i) => s + i.percentageScore, 0) / allInterviews.length;
    analytics.averageScore = Math.round(avgScore);
    if (percentageScore > analytics.bestScore) analytics.bestScore = percentageScore;
    await analytics.save();

    // Update user's totalInterviews and averageScore
    await User.findByIdAndUpdate(req.user.id, { totalInterviews: analytics.totalInterviews, averageScore: analytics.averageScore });

    // Send report email
    const user = await User.findById(req.user.id);
    emailService.sendInterviewReportEmail(user.email, user.name, {
      score: percentageScore,
      domain: interview.domain,
      strengths: feedbackData.strengths || [],
      improvements: feedbackData.improvements || [],
    }).catch(err => logger.error('Report email error:', err));

    res.status(200).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

exports.getUserInterviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-questions -answers');
    const total = await Interview.countDocuments({ userId: req.user.id });
    res.status(200).json({ success: true, interviews, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.updateAntiCheating = async (req, res, next) => {
  try {
    const { event } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    const fieldMap = { tabSwitch: 'tabSwitches', multipleFace: 'multipleFaces', noFace: 'noFaceDetected', copyPaste: 'copyPasteAttempts' };
    if (fieldMap[event]) {
      interview.antiCheating[fieldMap[event]] += 1;
      const total = interview.antiCheating.tabSwitches + interview.antiCheating.multipleFaces +
        interview.antiCheating.noFaceDetected + interview.antiCheating.copyPasteAttempts;
      if (total > 5) interview.antiCheating.flagged = true;
      await interview.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
