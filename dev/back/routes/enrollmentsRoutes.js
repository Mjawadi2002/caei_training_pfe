const express=require('express');
const router=express.Router();
const enrollmentController=require('../controllers/enrollmentsController');

router.get('/',enrollmentController.getAllEnrollments);
router.get('/count',enrollmentController.getCountEnrollments);
router.get('/count/:id',enrollmentController.getCountEnrollmentsById);
router.get('/:id',enrollmentController.getEnrollmentByUserId);
router.get('/evaluations/:id',enrollmentController.showEnrollmentByFormationId);
router.post('/',enrollmentController.registerFormation);
router.put('/:id',enrollmentController.updateEnrollment);
router.delete('/:id',enrollmentController.deleteEnrollment);
router.put("/evaluations/:id", enrollmentController.updateRating);


module.exports = router;