const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const { authenticateToken, authorizeRoles } = require('../middlewares/middleware');

router.get('/',formationController.getAllFormations);
router.get('/name/:name',formationController.getFormationByName);
router.post('/',authenticateToken, authorizeRoles('admin'),formationController.createFormation);
router.put('/:id',authenticateToken, authorizeRoles('admin'),formationController.updateFormation);
router.delete('/:id',authenticateToken, authorizeRoles('admin'),formationController.deleteFormation);


module.exports=router;