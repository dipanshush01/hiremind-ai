const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

module.exports = (io) => {
  // Auth middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.user.name} (${socket.id})`);

    socket.on('join-interview', (interviewId) => {
      socket.join(`interview:${interviewId}`);
      socket.emit('joined-interview', { interviewId, message: 'Joined interview room' });
    });

    socket.on('leave-interview', (interviewId) => {
      socket.leave(`interview:${interviewId}`);
    });

    socket.on('answer-typing', ({ interviewId, isTyping }) => {
      socket.to(`interview:${interviewId}`).emit('candidate-typing', { isTyping });
    });

    socket.on('timer-sync', ({ interviewId, timeLeft }) => {
      io.to(`interview:${interviewId}`).emit('timer-update', { timeLeft });
    });

    socket.on('coding-change', ({ roundId, code, language }) => {
      socket.to(`coding:${roundId}`).emit('code-updated', { code, language });
    });

    socket.on('join-coding', (roundId) => {
      socket.join(`coding:${roundId}`);
    });

    socket.on('anti-cheat-event', ({ interviewId, event }) => {
      logger.warn(`Anti-cheat event: ${event} by ${socket.user.name} in interview ${interviewId}`);
      io.to(`interview:${interviewId}`).emit('cheat-detected', { event, userId: socket.user._id });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.user.name}`);
    });
  });
};
