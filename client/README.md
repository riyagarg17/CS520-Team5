# CareCompass Frontend Documentation

## Overview
CareCompass is a healthcare management system built with React, focusing on providing an intuitive interface for both patients and healthcare providers. The application uses modern React practices, including hooks, context, and a component-based architecture.

## Technology Stack
- **React 18**: Core framework
- **Ant Design 5.x**: UI component library
- **React Router 6**: Navigation and routing
- **Axios**: HTTP client
- **Chart.js**: Data visualization
- **Lottie**: Animations
- **Jest & React Testing Library**: Testing framework

## Architecture

### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (buttons, inputs)
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── doctor/         # Doctor dashboard and related pages
│   └── patient/        # Patient dashboard and related pages
└── context/            # Global state management
```

### State Management
- **UserContext**: Manages user authentication state and profile
- **Local State**: Component-specific state using useState
- **Form State**: Managed by Ant Design Form components

## Key Features

### Authentication System
- Secure login/registration for both doctors and patients
- Password strength validation
- MFA (Multi-Factor Authentication) support
- Session management using JWT tokens

### Doctor Dashboard
- Patient list with health zone indicators
- Real-time analytics and statistics
- Patient health monitoring
- Alert system for critical cases
- Appointment management

### Patient Dashboard
- Health metrics tracking
- Appointment scheduling
- Health zone status
- Medical history view
- Interactive health data visualization

## Implementation Details

### Authentication Flow
```javascript
// Example of login flow
const handleLogin = async (values) => {
    try {
        const response = await loginUser(values);
        if (response.requiresMFA) {
            // Handle MFA flow
            setShowMFA(true);
            setTempToken(response.tempToken);
        } else {
            // Direct login
            setUser(response.userData);
            navigate(response.userData.role === 'doctor' ? '/doctor' : '/patient');
        }
    } catch (error) {
        handleError(error);
    }
};
```

### Health Zone Classification
The system uses three health zones:
- 🔴 **Red Zone**: Critical attention needed
- 🟡 **Yellow Zone**: Monitoring required
- 🟢 **Green Zone**: Healthy status


### API Integration

#### Authentication Endpoints
```javascript
POST /doctors/login          // Doctor login
POST /patients/login         // Patient login
POST /mfa/verifyOtp         // Verify MFA code
POST /mfa/generateQrCode    // Generate MFA QR code
```

#### Doctor Endpoints
```javascript
POST /doctors/addDoctor              // Register new doctor
GET  /doctors/getAllDoctors          // Get all doctors
GET  /doctors/appointments/:email    // Get doctor's appointments
PUT  /doctors/appointments/:id/status // Update appointment status
POST /doctors/getPatients           // Get doctor's patients
POST /doctors/getBookedTimes        // Get doctor's booked times
POST /doctors/doctor/doctorSchedule // Set doctor availability
POST /doctors/alert-patient         // Send alert to patient
```

#### Patient Endpoints
```javascript
POST /patients/addPatient           // Register new patient
POST /patients/updatePatient        // Update patient info
POST /patients/healthDetails        // Get patient health details
GET  /patients/appointments         // Get patient appointments
POST /patients/appointmentUpdate    // Update appointment
POST /patients/scheduleAppointment  // Schedule new appointment
```

#### Chatbot Endpoints
```javascript
POST /chat/sendMessage    // Send message to chatbot
POST /chat/generate      // Generate chatbot response
```



## Testing

### Unit Tests
- Component testing using React Testing Library
- API mocking with Jest
- Context testing

```javascript
// Example test
describe('PatientDashboard', () => {
    it('displays health metrics correctly', () => {
        render(<PatientDashboard />);
        expect(screen.getByText('Blood Glucose')).toBeInTheDocument();
        expect(screen.getByText('BMI')).toBeInTheDocument();
    });
});
```

### Integration Tests
- User flow testing
- Form submission testing
- Route navigation testing






### API Error Handling
- Centralized error handling
- User-friendly error messages
- Error logging and monitoring

## Build and Deployment

### Development
```bash
npm install        # Install dependencies
npm start         # Start development server
npm test          # Run tests
npm run lint      # Run linting
```

### Production
```bash
npm run build     # Create production build
```


## Future Improvements


1. **Features**
   - Real-time chat
   - Video consultations
   - Health report generation

2. **UX Improvements**
   - Enhanced animations
   - Offline support
   - Accessibility improvements
