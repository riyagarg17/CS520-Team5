import express from "express"; 
import {createPatient, updatePatientById, getPatientById, deletePatientById} from "../controllers/PatientControllers.js";
import { handleMessage } from "../controllers/chatbotController.js";

const router = express.Router(); 

router.post("/addPatient", createPatient);
router.put("/updatePatient/:id", updatePatientById);
router.get("/getPatient/:id", getPatientById);
router.delete("/deletePatient/:id", deletePatientById);

// Chatbot routes
router.post("/sendMessage", handleMessage);

/*

router.post("/", function); 
router.get()
router.put()
router.delete()

*/

export default router; 