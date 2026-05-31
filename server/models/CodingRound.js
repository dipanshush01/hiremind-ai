const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  actualOutput: String,
  passed: { type: Boolean, default: false },
  executionTime: Number,
});

const codingRoundSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: {
    title: String,
    description: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    examples: [{ input: String, output: String, explanation: String }],
    constraints: [String],
    tags: [String],
  },
  submissions: [{
    code: String,
    language: { type: String, default: 'javascript' },
    output: String,
    error: String,
    testCases: [testCaseSchema],
    testCasesPassed: Number,
    totalTestCases: Number,
    executionTime: Number,
    submittedAt: { type: Date, default: Date.now },
    score: Number,
  }],
  finalCode: String,
  finalLanguage: String,
  finalScore: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 45 },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'timeout'], default: 'pending' },
  aiCodeReview: {
    quality: Number,
    efficiency: Number,
    readability: Number,
    feedback: String,
    suggestions: [String],
  },
}, { timestamps: true });

module.exports = mongoose.model('CodingRound', codingRoundSchema);
