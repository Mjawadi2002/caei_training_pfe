const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const { authenticateToken, authorizeRoles } = require('../middlewares/middleware');

router.get('/',formationController.getAllFormations);
router.get('/formateur/:idformateur',authenticateToken, formationController.getFormationsOfFormateur);
router.get('/name/:name',formationController.getFormationByName);
router.post('/',authenticateToken,formationController.createFormation);
router.put('/:id',authenticateToken,formationController.updateFormation);
router.put('/name/:name',authenticateToken,formationController.updateFormationByName);
router.delete('/:id',authenticateToken,formationController.deleteFormation);


module.exports=router;