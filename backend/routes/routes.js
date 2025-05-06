const express = require('express');
const router = express.Router();

// Import route modules
const patientRoutes = require('./patientRoutes');
const doctorRoutes = require('./doctorRoutes'); 
const chatbotRoutes = require('./chatbotRoutes');

// Mount them with base paths
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/chat', chatbotRoutes);

module.exports = router;
