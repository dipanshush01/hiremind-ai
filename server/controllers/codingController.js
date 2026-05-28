const CodingRound = require('../models/CodingRound');
const aiService = require('../services/aiService');
const User = require('../models/User');

exports.generateProblem = async (req, res, next) => {
  try {
    const { domain, difficulty, interviewId } = req.body;
    const user = await User.findById(req.user.id);
    const problem = await aiService.generateCodingProblem({
      domain: domain || 'JavaScript',
      difficulty: difficulty || 'medium',
      skills: user.skills || [],
    });
    const codingRound = await CodingRound.create({
      interviewId: interviewId || new require('mongoose').Types.ObjectId(),
      userId: req.user.id,
      problem,
      status: 'in-progress',
      timeLimit: difficulty === 'hard' ? 60 : difficulty === 'easy' ? 30 : 45,
    });
    res.status(201).json({ success: true, codingRound });
  } catch (error) {
    next(error);
  }
};

exports.submitCode = async (req, res, next) => {
  try {
    const { code, language, output, testResults } = req.body;
    const codingRound = await CodingRound.findById(req.params.id);
    if (!codingRound) return res.status(404).json({ success: false, message: 'Coding round not found' });
    if (codingRound.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const passedCount = testResults?.filter(t => t.passed).length || 0;
    const totalCount = testResults?.length || 0;
    const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

    const aiReview = await aiService.reviewCode({
      code, language,
      problem: codingRound.problem,
      testResults,
    });

    const submission = { code, language, output, testCases: testResults, testCasesPassed: passedCount, totalTestCases: totalCount, score };
    codingRound.submissions.push(submission);
    codingRound.finalCode = code;
    codingRound.finalLanguage = language;
    codingRound.finalScore = score;
    codingRound.aiCodeReview = aiReview;
    codingRound.status = 'completed';
    await codingRound.save();

    res.status(200).json({ success: true, submission, aiReview, score });
  } catch (error) {
    next(error);
  }
};

exports.getCodingRound = async (req, res, next) => {
  try {
    const codingRound = await CodingRound.findById(req.params.id);
    if (!codingRound) return res.status(404).json({ success: false, message: 'Not found' });
    if (codingRound.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, codingRound });
  } catch (error) {
    next(error);
  }
};

exports.getUserCodingHistory = async (req, res, next) => {
  try {
    const rounds = await CodingRound.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('problem.title problem.difficulty finalScore status createdAt');
    res.status(200).json({ success: true, rounds });
  } catch (error) {
    next(error);
  }
};
