// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginPatient, loginDoctor, verifyMFA, resendMFA } = require("../controllers/authController");

router.post("/patients/login", loginPatient);
router.post("/doctors/login", loginDoctor);
router.post("/verify-mfa", verifyMFA);
router.post("/resend-mfa", resendMFA);

module.exports = router;
