const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  category: { type: String, enum: ['technical', 'behavioral', 'situational', 'coding'], default: 'technical' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  expectedAnswer: { type: String },
  followUpQuestions: [String],
});

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId },
  questionText: String,
  answerText: String,
  audioUrl: String,
  videoUrl: String,
  score: { type: Number, min: 0, max: 10 },
  feedback: String,
  timeSpent: Number,
  aiAnalysis: {
    confidence: Number,
    clarity: Number,
    technicalAccuracy: Number,
    grammarScore: Number,
    keywordsMatched: [String],
  },
  submittedAt: { type: Date, default: Date.now },
});

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
  jobRole: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'abandoned'], default: 'pending' },
  questions: [questionSchema],
  answers: [answerSchema],
  totalScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  percentageScore: { type: Number, default: 0 },
  overallFeedback: { type: String },
  strengths: [String],
  improvements: [String],
  duration: { type: Number, default: 0 },
  startedAt: Date,
  completedAt: Date,
  sessionRecordingUrl: String,
  antiCheating: {
    tabSwitches: { type: Number, default: 0 },
    multipleFaces: { type: Number, default: 0 },
    noFaceDetected: { type: Number, default: 0 },
    copyPasteAttempts: { type: Number, default: 0 },
    flagged: { type: Boolean, default: false },
  },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
