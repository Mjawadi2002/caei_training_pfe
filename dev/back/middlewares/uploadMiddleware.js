const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const formationsDir = path.join(__dirname, '..', 'uploads', 'formations');
const profilesDir = path.join(__dirname, '..', 'uploads', 'profiles');

[formationsDir, profilesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Set up storage for formation images
const formationStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, formationsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'formation-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Set up storage for profile images
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profilesDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
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

// Create separate upload instances for formations and profiles
const uploadFormation = multer({ 
    storage: formationStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const uploadProfile = multer({ 
    storage: profileStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = {
    uploadFormation,
    uploadProfile
};
