const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // Add your Netlify URL here after deploying
  // 'https://your-app-name.netlify.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.CLIENT_URL === origin) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in dev - restrict in production
    }
  },
  credentials: true,
};

module.exports = corsOptions;
