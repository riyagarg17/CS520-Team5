import fetchClient from "../client";
import { ENDPOINTS } from "../endpoint";

export const updateHealthDetails = async (email, healthDetails) => {
  const url = `${ENDPOINTS.updatePatient}`;
  return fetchClient(url, {
    method: "POST",
    body: JSON.stringify({ email, health_details: healthDetails }),
  });
};

export const getPatientHealthDetails = async (email) => {
    try {
      const response = await fetch(ENDPOINTS.getHealthDetails, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      // console.log("response from backend patient details: ", response)
      if (!response.ok) {
        throw new Error(`Failed to fetch health details: ${response.status}`);
      }
  
      const data = await response.json();
      return data.health_details; 
    } catch (error) {
      console.error("getPatientHealthDetails error:", error);
      throw error;
    }
  };

  export const getAppointmentsByPatient = async (email) => {
    try {
      const url = `${ENDPOINTS.getAppointments}?email=${encodeURIComponent(email)}`;
      const response = fetchClient(url);
      console.log("appointments: ", response)
      return response;
    } catch (error) {
      throw error;
    }
  };


  export const getAllDoctors = async () => {
    try {
        const response = await fetchClient(ENDPOINTS.getAllDoctors);
        return response;
    } catch (error) {
        console.error("getAllDoctors Error:", error);
        throw error;
    }
};

// POST: Schedule an appointment
export const scheduleAppointment = async (appointmentData) => {
    try {
        const response = await fetchClient(ENDPOINTS.scheduleAppointment, {
            method: "POST",
            body: JSON.stringify(appointmentData)
        });
        return response;
    } catch (error) {
        console.error("scheduleAppointment Error:", error);
        throw error;
    }
};

export const getBookedTimes = async (doctorEmail, appointment_date) => {
  try {
      const url = ENDPOINTS.getBookedTimes;
      const response = await fetchClient(url, {
          method: "POST",
          body: JSON.stringify({ doctorEmail, appointment_date }),
      });
      return response;
  } catch (error) {
      console.error("Get Booked Times Error:", error);
      throw error;
  }
};

export const updateAppointment = async (payload) => {
  console.log("update appt: ", payload)
  try {
    const response = await fetchClient(ENDPOINTS.updateAppointment, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    throw error;
  }
};