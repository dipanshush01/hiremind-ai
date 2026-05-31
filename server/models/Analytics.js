const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalInterviews: { type: Number, default: 0 },
  completedInterviews: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  totalCodingRounds: { type: Number, default: 0 },
  codingSuccessRate: { type: Number, default: 0 },
  skillScores: [{
    skill: String,
    score: Number,
    interviewsCount: Number,
  }],
  domainPerformance: [{
    domain: String,
    averageScore: Number,
    attempts: Number,
  }],
  weeklyActivity: [{
    week: String,
    interviewsCount: Number,
    averageScore: Number,
  }],
  confidenceScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
  weakTopics: [String],
  strongTopics: [String],
  improvementRate: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastInterviewDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
