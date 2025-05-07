const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointment_id: { type: String, required: true },
  patient_email: String,
  patient_name: String,
  doctor_email: String,
  doctor_name: String,
  appointment_date: String,
  appointment_time: String,
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  
}, { _id: false });

module.exports = appointmentSchema;
