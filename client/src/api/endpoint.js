// import { verifyTimeOtp } from "./services/mfaService";

export const API_BASE_URL = "http://127.0.0.1:8080";

export const ENDPOINTS = {
    getAllDoctors: `${API_BASE_URL}/doctors/getAllDoctors`,
    scheduleAppointment: `${API_BASE_URL}/patients/scheduleAppointment`,
    chatAssistant: `${API_BASE_URL}/chat/generate`,
    patientLogin: `${API_BASE_URL}/patients/login`,
    doctorLogin: `${API_BASE_URL}/doctors/login`,
    getRegistrationQrCode: `${API_BASE_URL}/mfa/generateQrCode`,
    verifyOtp: `${API_BASE_URL}/mfa/verifyOtp`,
    addPatient: `${API_BASE_URL}/patients/addPatient`,
    updatePatient:`${API_BASE_URL}/patients/updatePatient`,
    getHealthDetails: `${API_BASE_URL}/patients/healthDetails`,
    getAppointments: `${API_BASE_URL}/patients/appointments`, 
    updateAppointment: `${API_BASE_URL}/patients/appointmentUpdate`, 
    addDoctor: `${API_BASE_URL}/doctors/addDoctor`,
    setDoctorAvailability: `${API_BASE_URL}/doctors/doctor/doctorSchedule`,
    sendEmail: `${API_BASE_URL}/email/send-email`,
    updateAppointmentStatus: (appointment_id) => `${API_BASE_URL}/doctors/appointments/${appointment_id}/status`,
    doctorByEmail: (email) => `${API_BASE_URL}/doctors/doctor/${email}`,
    getDoctorByEmail: (email) => `${API_BASE_URL}/doctors/${email}/schedule`,
    getBookedTimes: `${API_BASE_URL}/doctors/getBookedTimes`,
};