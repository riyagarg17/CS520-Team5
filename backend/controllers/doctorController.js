const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor');
const Patient = require('../models/patient');
const sendEmail = require('../utils/emailService')

exports.registerDoctor = async (req, res) => {
  // console.log("BODY:", req.body);
  // console.log("FILES:", req.file);
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


// Fetch appointments by doctor email
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { email } = req.params;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log("DOCTOR appt;", doctor.appointments || [])
    res.status(200).json(doctor.appointments || []);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update status of a specific appointment
exports.updateAppointmentStatus = async (req, res) => {
  try {
    // console.log("Change doctor appt status: ", req.body)
    const { appointment_id } = req.params;
    const { newStatus, doctorEmail, patientEmail } = req.body;
    console.log("Received appointment_id:", appointment_id);
    // console.log(doctorEmail,patient_email)

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
      // sendEmail(patientEmail, "Appointment Status changed", `Your appointment has been ${newStatus}`)
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
    // sendEmail(patientEmail, "Appointment Status changed", `Your appointment has been ${newStatus}`)
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "-password -medicalCertificate"); // exclude sensitive info
    res.status(200).json({ status_code: 200, body: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ status_code: 500, message: "Internal Server Error" });
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


exports.getBookedTimes = async (req, res) => {
  try {
    // console.log("get booked: ", req.body)
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