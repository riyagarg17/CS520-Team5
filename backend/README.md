# CareCompass Backend Documentation

## Overview
The CareCompass backend is built with Node.js and Express, providing a robust API for healthcare management and real-time health monitoring. It integrates with MongoDB for data storage and implements secure authentication mechanisms.

## Setup
Follow installation instructions in main README.md, especially setting up the Node.js environment.

API keys such as the mongodb and OpenAI keys are needed to run the backend. Create a .env file in this directory to store the keys if the file is not already present.

### Install dependencies
```bash
npm install
```

### Start the backend 
```bash
node app.js
```

## Models
More information about data models can be found in models-readme.md.

## Controllers
Controllers serve as the interface between users of the data and the underlying data models. Controllers are split up into three main use cases:
- **Doctor Controller:** Handles requests from doctors such as upcoming appointments and patient health information
- **Patient Controller:** Handles requests from patients such as upcoming appointments and doctor information
- **Chatbot Controller:** Handles requests to the chatbot such as sending messages and getting responses. The chatbot is powered by OpenAI's GPT-4 model.

## Architecture

### Directory Structure
```
backend/
├── controllers/        # Business logic and request handlers
├── models/            # MongoDB schemas and models
├── routes/            # Express route definitions
├── utils/             # Helper functions and utilities
└── tests/            # Test suite
```

### Key Features

### Authentication System
- JWT-based authentication
- Password hashing with bcrypt
- Email-based MFA using OTP
- Session management

### Health Monitoring
- Real-time health metrics tracking
- Automated health zone classification
- Historical data analysis
- Alert system for critical health conditions

## API Endpoints

### Authentication
```javascript
POST /doctors/login          // Doctor login
POST /patients/login         // Patient login
POST /mfa/verifyOtp         // Verify MFA code
POST /mfa/generateQrCode    // Generate MFA QR code
```

### Doctor Routes
```javascript
POST /doctors/addDoctor              // Register new doctor
GET /doctors/getAllDoctors           // Get all doctors
GET /doctors/appointments/:email     // Get doctor's appointments
PUT /doctors/appointments/:id/status // Update appointment status
POST /doctors/getPatients           // Get doctor's patients
POST /doctors/getBookedTimes        // Get doctor's booked times
POST /doctors/doctor/doctorSchedule // Set doctor availability
```

### Patient Routes
```javascript
POST /patients/addPatient           // Register new patient
POST /patients/updatePatient        // Update patient info
GET /patients/healthDetails         // Get patient health details
GET /patients/appointments          // Get patient appointments
POST /patients/appointmentUpdate    // Update appointment
POST /patients/scheduleAppointment  // Schedule new appointment
```

### Chatbot Routes
```javascript
POST /chat/sendMessage    // Send message to chatbot
POST /chat/generate      // Generate chatbot response
```

### Email Service
```javascript
POST /email/send-email   // Send email notifications
```

## Implementation Details

### Authentication Flow
```javascript
const loginDoctor = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await Doctor.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status_code: 401,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status_code: 401,
        message: "Invalid email or password",
      });
    }

    // Generate and send MFA code
    const mfaCode = await sendMFACode(email);
    const tempToken = jwt.sign(
      { userId: user._id, userType: 'doctor', email },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );
    
    return res.status(200).json({
      status_code: 200,
      requiresMFA: true,
      message: "MFA code sent successfully",
      tempToken
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Internal server error",
    });
  }
};
```

### Database Operations Example
```javascript
// Schedule an appointment
exports.scheduleAppointment = async (req, res) => {
  const { patientEmail, doctorEmail, appointment_date, appointment_time } = req.body;

  try {
    const patient = await Patient.findOne({ email: patientEmail });
    const doctor = await Doctor.findOne({ email: doctorEmail });

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

    // Update both patient and doctor records
    await Patient.updateOne(
      { email: patientEmail },
      { $push: { appointments: newAppointment } }
    );
    
    await Doctor.updateOne(
      { email: doctorEmail },
      { 
        $push: { 
          appointments: newAppointment,
          patients: { email: patient.email, name: patient.name }
        }
      }
    );

    return res.status(201).json({
      status_code: 201,
      message: "Appointment scheduled successfully",
      body: { appointment_id }
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: "Internal server error"
    });
  }
};
```

## Security Measures

### Data Protection
- Input validation
- Password hashing with bcrypt
- JWT token encryption
- MFA implementation

### API Security
- CORS configuration
- Request validation
- API key management
- Helmet security headers

## Monitoring and Logging

### Logging Configuration
```javascript
const pino = require('pino');

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
```

## Environment Variables
Required environment variables in `.env`:
```
MONGODB_URI=your_mongodb_uri
PORT=backend_port
SENDGRID_API_KEY=sendgrid_api_key
SENDGRID_VERIFIED_SENDER=riyagarg8d@gmail.com
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
OPENAI_API_KEY=your_openai_key

```

Contact the dev team for these credentials. 

## Future Improvements

1. **Features**
   - Enhanced ML model integration
   - Real-time notifications
   - Automated reporting system

2. **Infrastructure**
   - Docker containerization
   - CI/CD pipeline
   - Kubernetes deployment