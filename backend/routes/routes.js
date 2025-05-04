import express from "express"; 
import { createPatient, getPatients, getPatientById, updatePatient, deletePatient } from "../controllers/patientController.js";
import { predictObesityRisk } from "../controllers/obesityRiskController.js";

const router = express.Router(); 

// Patient routes
router.post("/patients", createPatient);
router.get("/patients", getPatients);
router.get("/patients/:id", getPatientById);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatient);

// Obesity risk prediction route
router.post("/obesity-risk/predict", predictObesityRisk);

/*

router.post("/", function); 
router.get()
router.put()
router.delete()

*/

export default router; 