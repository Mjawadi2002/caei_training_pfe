const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '..', 'uploads', 'formations');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'formation-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
