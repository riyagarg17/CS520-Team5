const express = require('express');
const router = express.Router();
const { predictObesityRisk } = require('../controllers/obesityRiskController');

router.post('/predict', async (req, res) => {
    try {
        const healthData = req.body;
        const prediction = predictObesityRisk(healthData);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: 'Error predicting obesity risk' });
    }
});

module.exports = router; 