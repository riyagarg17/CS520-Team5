const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addDoctor', upload.single('license'), doctorController.registerDoctor);
router.get('/appointments/:email', doctorController.getDoctorAppointments);
router.put('/appointments/:appointment_id/status', doctorController.updateAppointmentStatus);
router.get("/getAllDoctors", doctorController.getAllDoctors);
router.post("/getBookedTimes", doctorController.getBookedTimes);
module.exports = router;