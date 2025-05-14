const { DynamicTool } = require("@langchain/core/tools");
const doctorController = require("./doctorController");

// A helper function to make HTTP requests to the backend API.
// It sets default headers and handles basic error checking.
const fetchClient = async (url, options = {}) => {
  try {
      const response = await fetch(url, {
          headers: {
              "Content-Type": "application/json",
              ...options.headers,
          },
          ...options,
      });
      if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error("Fetch Client Error:", error.message);
      throw error;
  }
};

const API_BASE_URL = `http://localhost:${process.env.PORT}`; // Adjust this to your API base URL

// Tool for doctors to retrieve their upcoming appointments.
const getDoctorAppointments = new DynamicTool({
  name: "get_appointments",
  description: 'Gets the appointment details for a specific doctor email. This tool can only be used by users that have the doctor type. \
  Input: doctor email. \
  Output: a list of appointments, which includes: patient name, email, time, and health details of each of their upcoming appointments.\
  Tell the user who the patient is and the appointment time.',
  func: async (email) => {
    // Simulate fetching appointment details
    const url = `${API_BASE_URL}/doctors/appointments/${email}`;
    try {
      const response = await fetchClient(url, { method: "GET" });

      if (!response || response.length === 0) {
        return "No appointments found for this doctor, or there was an issue retrieving them.";
      }

      return JSON.stringify(response, null, 2);// Pretty print JSON
      
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
      return "Error fetching doctor appointments: " + error.toString();
    }
  },
});

// Tool for doctors to cancel an existing appointment.
const updateDoctorAppointmentTool = new DynamicTool({
  name: "cancel_appointment",
  description: `Cancels a specific appointment. This tool can only be used by users that have the doctors type. \
  Input: a JSON string containing 'appointment_id', 'doctorEmail', and 'patientEmail'. \
  Output: a confirmation message or an error message.`,
  func: async (inputJson) => {
    let input;
    try {
      input = JSON.parse(inputJson);
    } catch (e) {
      return "Invalid input: Expected a JSON string with 'appointment_id', 'doctorEmail', and 'patientEmail'.";
    }

    const { appointment_id, doctorEmail, patientEmail } = input;

    if (!appointment_id || !doctorEmail || !patientEmail) {
      return "Missing required fields in input: 'appointment_id', 'doctorEmail', and 'patientEmail' are required.";
    }

    const url = `${API_BASE_URL}/doctors/appointments/${appointment_id}/status`;
    const body = {
      newStatus: "Cancelled",
      doctorEmail: doctorEmail,
      patientEmail: patientEmail,
    };

    try {
      const response = await fetchClient(url, {
        method: "PUT", // Assuming PUT method for updates
        body: JSON.stringify(body),
      });
      // Assuming the API returns a message on success
      return response.message || "Appointment cancelled successfully.";
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      return "Error cancelling appointment: " + error.toString();
    }
  },
});

// Tool for patients to retrieve their upcoming appointments.
const getPatientAppointmentsTool = new DynamicTool({
  name: "get_patient_appointments",
  description: `Gets the appointment details for a specific patient email. This tool can only be used by users that have the patient type.
  Input: patient email.
  Output: a list of appointments, which includes: doctor name, email, time, and status of each of their upcoming appointments.`,
  func: async (email) => {
    const url = `${API_BASE_URL}/patients/appointments?email=${encodeURIComponent(email)}`; // Use query parameter as per PatientControllers.js
    try {
      // Patient controller returns { status_code, body }
      const response = await fetchClient(url, { method: "GET" }); 

      // Check if the body exists and has appointments
      if (!response || !response.body || response.body.length === 0) {
        return "No appointments found for this patient, or there was an issue retrieving them.";
      }

      // Return the appointments array as a pretty-printed JSON string
      return JSON.stringify(response.body, null, 2); 

    } catch (error) {
      console.error("Error fetching patient appointments:", error);
      // Check if the error object has more details, e.g., from fetchClient
      const errorMessage = error.message || error.toString();
      return `Error fetching patient appointments: ${errorMessage}`;
    }
  },
});

// Create tools array
exports.doctor_tools = [getDoctorAppointments, updateDoctorAppointmentTool];
exports.patient_tools = [getPatientAppointmentsTool];