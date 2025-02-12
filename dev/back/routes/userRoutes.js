const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/middleware');


router.post('/login', userController.loginUser);


router.get('/', authenticateToken, authorizeRoles('admin','agent'), userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.get('/role/:role', authenticateToken, authorizeRoles('admin'), userController.getUsersType);
router.post('/', authenticateToken, authorizeRoles('admin'), userController.createUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);
router.put('/:id', authenticateToken,authorizeRoles('admin'), userController.updateUser);

module.exports = router;
