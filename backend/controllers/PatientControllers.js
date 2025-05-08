const bcrypt = require('bcrypt');
const Patient = require('../models/patient');
const Doctor = require('../models/Doctor');
const { v4: uuidv4 } = require('uuid');


exports.registerPatient = async (req, res) => {
  try {
    const { email, name, dob, gender, password, pincode } = req.body;
    console.log("Incoming body:", req.body);

    const existingPatient = await Patient.findOne({ email: email });
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
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({
        status_code: 400,
        message: "Email is required",
      });
    }

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({
        status_code: 404,
        message: "Patient not found",
      });
    }
    console.log("patient appointments are: ", patient.appointments)
    res.status(200).json({
      status_code: 200,
      body: patient.appointments || [],
    });
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({
      status_code: 500,
      message: "Server error while fetching appointments",
    });
  }
};



exports.scheduleAppointment = async (req, res) => {
  const { patientEmail, doctorEmail, appointment_date, appointment_time } = req.body;

  if (!patientEmail || !doctorEmail || !appointment_date || !appointment_time) {
    return res.status(400).json({
      status_code: 400,
      message: "Missing required appointment fields"
    });
  }

  try {
    const patient = await Patient.findOne({ email: patientEmail });
    const doctor = await Doctor.findOne({ email: doctorEmail });

    if (!patient || !doctor) {
      return res.status(404).json({
        status_code: 404,
        message: "Doctor or patient not found"
      });
    }


    const appointment_id = uuidv4();

    const newAppointment = {
      appointment_id,
      patient_email: patient.email,
      patient_name: patient.name,
      doctor_email: doctor.email,
      doctor_name: doctor.name,
      appointment_date,
      appointment_time,
      status: "Pending"
    };

    // Push appointment to both records
    patient.appointments.push(newAppointment);
    doctor.appointments.push(newAppointment);

    await patient.save();
    await Doctor.updateOne(
      { email: doctor.email },
      { $push: { appointments: newAppointment } }
    );
    
    // Only push patient if not already present
    const isPatientAlreadyAdded = doctor.patients.some(p => p.email === patient.email);
    if (!isPatientAlreadyAdded) {
      await Doctor.updateOne(
        { email: doctor.email },
        { $push: { patients: { email: patient.email, name: patient.name } } }
      );
    }

    return res.status(201).json({
      status_code: 201,
      message: "Appointment scheduled successfully",
      body: { appointment_id }
    });
  } catch (error) {
    console.error("Schedule Error:", error);
    return res.status(500).json({
      status_code: 500,
      message: "Internal server error"
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    console.log("update appointment: ", req.body)
    const { appointment_id, new_date, new_time, status } = req.body;

    if (!appointment_id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    // Update in Patient collection
    const patient = await Patient.findOneAndUpdate(
      { "appointments.appointment_id": appointment_id },
      {
        $set: {
          "appointments.$.appointment_date": new_date,
          "appointments.$.appointment_time": new_time,
          "appointments.$.status": status,
        },
      },
      { new: true }
    );

    // Update in Doctor collection
    const doctor = await Doctor.findOneAndUpdate(
      { "appointments.appointment_id": appointment_id },
      {
        $set: {
          "appointments.$.appointment_date": new_date,
          "appointments.$.appointment_time": new_time,
          "appointments.$.status": status,
        },
      },
      { new: true }
    );

    if (!patient || !doctor) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      status_code: 200,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    console.error("Update Appointment Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}, "-password -medicalCertificate"); // exclude sensitive info
    res.status(200).json({ status_code: 200, body: patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ status_code: 500, message: "Internal Server Error" });
  }
}