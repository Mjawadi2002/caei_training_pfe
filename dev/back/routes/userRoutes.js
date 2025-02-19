const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/middleware');

router.post('/login', userController.loginUser);
router.get('/', authenticateToken, authorizeRoles('admin'), userController.getAllUsers);
router.get('/count', authenticateToken, authorizeRoles('admin'), userController.countAllUsers);
router.get('/countClients',  userController.countAllClients);
router.get('/countFormations',  userController.countAllFormations);
router.get('/countFormateurs',  userController.countAllFormateurs);
router.get('/:id', authenticateToken, userController.getUserById);
router.get('/role/:role', authenticateToken, authorizeRoles('admin'), userController.getUsersType);
router.post('/', authenticateToken, authorizeRoles('admin'), userController.createUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);
router.put('/:id', authenticateToken, userController.updateUser);
router.post('/register', userController.registerUser);

module.exports = router;
