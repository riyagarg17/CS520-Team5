const mongoose = require('mongoose');
const appointmentSchema = require("./appointmentSchema");
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  dob: {
    type: Date,
    required: true,
  },

  pincode: {
    type: Number,
    required: true,
  },

  experience: {
    type: Number,
    required: true,
  },

  medicalCertificate: {
    type: Buffer,
    required: true,
  },

  appointments:  [appointmentSchema]
}, { collection: 'Doctor' });

module.exports = mongoose.model('Doctor', doctorSchema);


