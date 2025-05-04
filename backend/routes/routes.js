const express = require('express');
const router = express.Router();

// Import route modules
const patientRoutes = require('./patientRoutes');
const doctorRoutes = require('./doctorRoutes'); // assuming you have this too

// Mount them with base paths
router.use('/patients', patientRoutes);
// router.use('/doctors', doctorRoutes); // optional, if doctorRoutes exists

module.exports = router;
