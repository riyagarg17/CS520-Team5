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
