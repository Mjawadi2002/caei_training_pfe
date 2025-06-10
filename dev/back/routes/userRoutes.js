const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/middleware');
const { uploadProfile } = require('../middlewares/uploadMiddleware');

// User-related routes
router.post('/login', userController.loginUser);
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/count', authenticateToken, userController.countAllUsers);
router.get('/countClients', userController.countAllClients);
router.get('/countFormations', userController.countAllFormations);
router.get('/countFormateurs', userController.countAllFormateurs);
router.get('/role/:role', authenticateToken, authorizeRoles('admin'), userController.getUsersType);
router.get('/name/:name', authenticateToken, userController.getUserName);
router.get('/:id', authenticateToken, userController.getUserById);
router.post('/', authenticateToken, userController.createUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);
router.put('/:id', authenticateToken, userController.updateUser);
router.post('/register', uploadProfile.single('profileImage'), userController.registerUser);
router.post('/:id/profile-image', authenticateToken, uploadProfile.single('profileImage'), userController.uploadProfileImage);
router.get('/:id/profile-image', authenticateToken, userController.getProfileImage);

// Password reset routes
router.post('/forgot-password', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.post('/verify-reset-code', userController.verifyResetCode);

module.exports = router;
