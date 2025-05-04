// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginPatient } = require("../controllers/authController");

router.post("/patients/login", loginPatient);
// router.post("/doctorLogin", loginDoctor);

module.exports = router;
