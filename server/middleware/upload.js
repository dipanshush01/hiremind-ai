const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word files allowed for resume'), false);
    }
  } else if (file.fieldname === 'avatar') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed for avatar'), false);
    }
  } else {
    cb(null, true);
  }
};

exports.uploadResume = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('resume');
exports.uploadAvatar = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }).single('avatar');
