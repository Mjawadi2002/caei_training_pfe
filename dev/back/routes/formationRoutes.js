const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const { authenticateToken, authorizeRoles } = require('../middlewares/middleware');

router.get('/',formationController.getAllFormations);
router.get('/name/:name',formationController.getFormationByName);
router.post('/',authenticateToken, authorizeRoles('admin'),formationController.createFormation);
router.put('/:id',authenticateToken, authorizeRoles('admin'),formationController.updateFormation);
router.put('/name/:name',authenticateToken, authorizeRoles('admin'),formationController.updateFormationByName);
router.delete('/:id',authenticateToken, authorizeRoles('admin'),formationController.deleteFormation);


module.exports=router;