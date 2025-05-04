const bcrypt = require('bcrypt');
const Patient = require('../models/patient');

exports.registerPatient = async (req, res) => {
  try {
    const { email, name, dob, gender, password, pincode } = req.body;
    console.log("Incoming body:", req.body);

    const existingPatient = await Patient.findOne({ email:email });
    if (existingPatient) {
      console.log("Patient already exists", existingPatient);
      return res.status(400).json({ message: 'Email already registered', status_code: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      email,
      name,
      dob,
      gender,
      password: hashedPassword,
      pincode,
      appointments: [],
      health_details: {},
    });

    const savedPatient = await newPatient.save();
    console.log("New patient saved:", savedPatient);

    return res.status(200).json({ message: 'Patient registered successfully', body: savedPatient });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: 'Registration failed', error });
  }
};

exports.updateHealthDetails = async (req, res) => {
  const { email, health_details } = req.body;
  console.log("Update details: ", req.body)
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { email: email }, 
      { $set: { health_details } },
      { new: true }
    );
  
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
  
    res.status(200).json({ message: "Health details updated", patient: updatedPatient });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Update failed", error });
  }
};

exports.getHealthDetails = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("get patient details backend: ", req.body)
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({ health_details: patient.health_details || {} });
  } catch (error) {
    console.error("Error fetching health details:", error);
    res.status(500).json({ message: "Failed to fetch health details." });
  }
};

exports.getAppointmentsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    return res.json(patient.appointments || []);
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};