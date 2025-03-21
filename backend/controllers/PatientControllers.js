import Patient from "../models/patient.js";

export const createPatient = async (req, res) => { 

    const { name, age, role } = req.body; 

    try {
        await Patient.create({ name, age, role });
        
        res.status(201).json({ message: "Patient created",
        patient: { name, age, role } });

    } catch (error) {

        console.error(error); 
        res.status(500).json({ message: "Server Error" });
        return; 

    } 
}

// Get a patient by ID
export const getPatientById = async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update a patient by ID
export const updatePatientById = async (req, res) => {
    const { id } = req.params;
    const { name, age, role, zone, bloodGlucoseLevels, bmi, bloodPressure, insulinDosage } = req.body;

    try {
        const patient = await Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        await patient.update({ name, age, role, zone, bloodGlucoseLevels, bmi, bloodPressure, insulinDosage });
        res.status(200).json({ message: "Patient updated", patient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete a patient by ID
export const deletePatientById = async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        await patient.destroy();
        res.status(200).json({ message: "Patient deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};



export default { createPatient, getPatientById, updatePatientById, deletePatientById };