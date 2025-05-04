const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointment_id: { type: String, required: true },
    doctor_email: String,
    doctor_name: String,
    appointment_date: String,
    appointment_time: String,
    status: { type: String, default: 'Pending' }
});

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
    health_details: healthDetailsSchema,
}, { collection: 'Patient' })

module.exports = mongoose.model('Patient', patientSchema);
