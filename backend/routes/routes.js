const express = require('express');
const router = express.Router();

// Import route modules
const patientRoutes = require('./patientRoutes');
const doctorRoutes = require('./doctorRoutes'); 

// Mount them with base paths
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes); 

module.exports = router;
