import express from "express"; 
import { createPatient, getPatients, getPatientById, updatePatient, deletePatient, generateMFA, verifyMFA, toggleMFA } from "../controllers/patientController.js";
import { predictObesityRisk } from "../controllers/obesityRiskController.js";

const router = express.Router(); 

// Patient routes
router.post("/patients", createPatient);
router.get("/patients", getPatients);
router.get("/patients/:id", getPatientById);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatient);

// MFA routes
router.post("/patients/mfa/generate", generateMFA);
router.post("/patients/mfa/verify", verifyMFA);
router.post("/patients/mfa/toggle", toggleMFA);

// Obesity risk prediction route
router.post("/obesity-risk/predict", predictObesityRisk);

/*

router.post("/", function); 
router.get()
router.put()
router.delete()

*/

export default router; 