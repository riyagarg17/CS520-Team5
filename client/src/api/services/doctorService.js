/**
 * Doctor service handling all API interactions for doctor-specific operations.
 * Manages appointments, patient lists, and doctor profile operations.
 */

import { API_BASE_URL } from "../endpoint";
import fetchClient from "../client";
import { ENDPOINTS } from "../endpoint";

// Fetch all appointments for a doctor
export const getDoctorAppointments = async (email) => {
  const url = `${API_BASE_URL}/doctors/appointments/${email}`;
  try {
    return await fetchClient(url, { method: "GET" });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    throw error;
  }
};

export const updateAppointmentStatus = async ({ appointment_id, newStatus, doctorEmail,patientEmail }) => {
  try {
    console.log("inside updateAppointmentStatus ", patientEmail)
    console.log("Received appointment_id:", appointment_id);
    const url = `${ENDPOINTS.updateAppointmentStatus(appointment_id)}`;
    return await fetchClient(url, {
      method: "PUT",
      body: JSON.stringify({ newStatus, doctorEmail, patientEmail }),
    });
  } catch (error) {
    throw error;
  }
};

// Get all patients for a doctor
export const getDoctorPatients = async (email) => {
  try {
    const url = ENDPOINTS.getDoctorPatients;
    return await fetchClient(url, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    console.error("Error fetching doctor patients:", error);
    throw error;
  }
};

// Send alert to a patient
export const alertPatient = async (email, name) => {
  try {
    const url = `${API_BASE_URL}/doctors/alert-patient`;
    return await fetchClient(url, {
      method: "POST",
      body: JSON.stringify({ email, name }),
    });
  } catch (error) {
    console.error("Error alerting patient:", error);
    throw error;
  }
};
