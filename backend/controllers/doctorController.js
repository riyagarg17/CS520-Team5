/**
 * Doctor controller managing all doctor-related operations including registration,
 * appointment management, patient list retrieval, and alert notifications.
 */

const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor');
const Patient = require('../models/patient');
const { sendEmail, sendAlertEmail } = require("../utils/emailService");

// Handles the registration of a new doctor.
// It checks for existing users, hashes the password, and saves the doctor to the database.
exports.registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      dob,
      pincode,
      experience
    } = req.body;

    const licenseFile = req.file.buffer
    if (!licenseFile) {
      return res.status(400).json({ message: "Medical license is required" });
    }

    // Check if already registered
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ status_code: 400, message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save doctor
    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      gender,
      dob,
      pincode,
      experience,
      medicalCertificate: licenseFile,
      appointments: [],
    });

    const savedDoctor = await newDoctor.save();

    return res.status(200).json({
      status_code: 200,
      message: "Doctor registered successfully",
      body: {
        name: savedDoctor.name,
        email: savedDoctor.email,
        gender: savedDoctor.gender,
        pincode: savedDoctor.pincode,
        experience: savedDoctor.experience,
        type: 'doctor'
      }
    });

  } catch (error) {
    console.error("Doctor registration error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Fetches all appointments for a specific doctor based on their email.
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { email } = req.params;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor.appointments || []);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Updates the status of a specific appointment for both doctor and patient.
// If the status is "Cancelled", it removes the appointment.
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const { newStatus, doctorEmail, patientEmail } = req.body;

    if (newStatus === "Cancelled") {
      // Remove from doctor's appointments
      await Doctor.updateOne(
        { email: doctorEmail },
        { $pull: { appointments: { appointment_id } } }
      );

      // Remove from patient's appointments
      await Patient.updateOne(
        { email: patientEmail },
        { $pull: { appointments: { appointment_id } } }
      );
      // Uncomment only in prod 
      sendEmail(patientEmail, "Appointment Status changed", `Your appointment has been ${newStatus}`)
      return res.status(200).json({ message: "Appointment cancelled and removed" });
    }
    
    const doctorUpdate = await Doctor.updateOne(
      { email: doctorEmail, "appointments.appointment_id": appointment_id },
      { $set: { "appointments.$.status": newStatus } }
    );
    // Update in Patient collection
    const patientUpdate = await Patient.updateOne(
      { email: patientEmail, "appointments.appointment_id": appointment_id },
      { $set: { "appointments.$.status": newStatus } }
    );
    if (doctorUpdate.modifiedCount === 0 || patientUpdate.modifiedCount === 0) {
      return res.status(404).json({ message: "Appointment not found or not updated." });
    }
    res.status(200).json({
      message: "Appointment status updated in both doctor and patient records",
      doctorUpdate,
      patientUpdate
    });
    // Uncomment only in prod 
    sendEmail(patientEmail, "Appointment Status changed", `Your appointment has been ${newStatus}`)
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Retrieves a list of all doctors, excluding sensitive information like passwords and medical certificates.
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "-password -medicalCertificate"); // exclude sensitive info
    res.status(200).json({ status_code: 200, body: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ status_code: 500, message: "Internal Server Error" });
  }
};

// Fetches the booked appointment times for a specific doctor on a given date.
exports.getBookedTimes = async (req, res) => {
  try {
    const { doctorEmail, appointment_date } = req.body;

    if (!doctorEmail || !appointment_date) {
      return res.status(400).json({ message: "Missing parameters", status_code: 400 });
    }

    const doctor = await Doctor.findOne({ email: doctorEmail });

    if (!doctor || !Array.isArray(doctor.appointments)) {
      return res.status(200).json({ status_code: 200, body: [] }); // No appointments yet
    }

    const bookedTimes = doctor.appointments
      .filter(app => app.appointment_date === appointment_date && app.status !== "Cancelled")
      .map(app => app.appointment_time);

    res.status(200).json({ status_code: 200, body: bookedTimes });
  } catch (error) {
    console.error("Get booked times error:", error);
    res.status(500).json({ status_code: 500, message: "Server error" });
  }
};

// Retrieves the list of patients associated with a specific doctor.
exports.getDoctorPatients = async (req, res) => {
  try {
    const { email } = req.body;

    const doctor = await Doctor.findOne({ email });

    if (!doctor || !doctor.patients) {
      return res.status(404).json({ message: "Doctor not found or no patients." });
    }

    const patientEmails = doctor.patients.map(p => p.email);

    const patients = await Patient.find({ email: { $in: patientEmails } });

    res.status(200).json({ status_code: 200, body: patients });
  } catch (error) {
    console.error("Error fetching doctor patients:", error);
    res.status(500).json({ status_code: 500, message: "Internal server error" });
  }
};

// Sends an alert email to a patient.
exports.alertPatientByEmail = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Patient email and name are required" });
  }

  try {
    await sendAlertEmail(email, name);
    return res.status(200).json({ message: "Alert sent successfully" });
  } catch (err) {
    console.error("Email send failed:", err);
    return res.status(500).json({ message: "Failed to send alert" });
  }
};

