const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientControllers');

router.post('/addPatient', patientController.registerPatient);
router.post('/updatePatient', patientController.updateHealthDetails);
router.post('/healthDetails', patientController.getHealthDetails);
router.get('/appointments', patientController.getAppointmentsByEmail);
router.post('/appointmentUpdate', patientController.updateAppointment);
router.post("/scheduleAppointment", patientController.scheduleAppointment);

module.exports = router;