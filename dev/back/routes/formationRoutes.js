const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const { authenticateToken, authorizeRoles } = require('../middlewares/middleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', formationController.getAllFormations);
router.get('/name/:name', formationController.getFormationByName);
router.get('/formateur/:idformateur', formationController.getFormationsOfFormateur);
router.get('/category/:category', formationController.getFormationsByCategory);
router.get('/title/:title', formationController.getFormationsByTitle);
router.get('/search', formationController.getFormationsByCategoryAndTitle);

router.post('/', authenticateToken, upload.single('formationImage'), formationController.createFormation);
router.put('/:id', authenticateToken, upload.single('formationImage'), formationController.updateFormation);
router.put('/name/:name', authenticateToken, upload.single('formationImage'), formationController.updateFormationByName);
router.delete('/:id', authenticateToken, formationController.deleteFormation);

module.exports = router;
