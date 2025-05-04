import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    doctor_email: String,
    doctor_name: String,
    appointment_date: String,
    appointment_time: String,
    status: String
});

const HealthDetailsSchema = new mongoose.Schema({
    zone: {
        type: String,
        enum: ['Red', 'Yellow', 'Green']
    },
    bloodGlucoseLevels: Number,
    bmi: Number,
    bloodPressure: String,
    insulinDosage: Number
});

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    appointments: [AppointmentSchema],
    health_details: HealthDetailsSchema,
    mfaSecret: {
        type: String,
        default: null
    },
    mfaEnabled: {
        type: Boolean,
        default: false
    },
    mfaBackupCodes: [{
        type: String
    }]
}, { collection: 'Patient' });

const Patient = mongoose.model('Patient', PatientSchema);

export default Patient; 