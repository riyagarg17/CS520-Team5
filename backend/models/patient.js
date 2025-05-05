const mongoose = require("mongoose");
const appointmentSchema = require("./appointmentSchema");

const healthDetailsSchema = new mongoose.Schema({
  zone: { type: String, enum: ['Red', 'Yellow', 'Green'], default: 'Green' },
  bloodGlucoseLevels: Number,
  bmi: Number,
  bloodPressure: String,
  insulinDosage: Number
});

const patientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  dob: String,
  gender: String,
  password: String,
  pincode: Number,
  appointments: [appointmentSchema],
  health_details: healthDetailsSchema
}, { collection: 'Patient' });

module.exports = mongoose.model('Patient', patientSchema);
