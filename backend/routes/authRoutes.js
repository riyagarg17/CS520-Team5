// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginPatient,loginDoctor } = require("../controllers/authController");

router.post("/patients/login", loginPatient);
router.post("/doctors/login", loginDoctor);

module.exports = router;
