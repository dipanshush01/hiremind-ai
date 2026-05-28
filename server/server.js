require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Connect DB
connectDB();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }
});

// ✅ CORS — must be FIRST middleware before everything
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

const cors = require("cors");

app.use(
  cors({
    origin: "https://hiremind-career-ai.netlify.app",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// Rate limiting (relaxed for production)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, message: 'Too many requests' });
app.use('/api/', limiter);

// Health check (before auth routes)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'HireMind API running', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/coding', require('./routes/codingRoutes'));

// Socket.io
require('./sockets/interviewSocket')(io);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`HireMind server running on port ${PORT}`);
});

module.exports = { app, io };
