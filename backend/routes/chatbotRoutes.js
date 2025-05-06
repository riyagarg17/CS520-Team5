const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');


router.post('/sendMessage', chatbotController.handleMessage);
module.exports = router;