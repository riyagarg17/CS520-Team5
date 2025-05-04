const express = require('express');
const router = express.Router();
const patientController = require('../controllers/PatientControllers');

router.post('/addPatient', patientController.registerPatient);
router.post('/updatePatient', patientController.updateHealthDetails);
router.post('/healthDetails', patientController.getHealthDetails);
router.get('/appointments', patientController.getAppointmentsByEmail);
module.exports = router;