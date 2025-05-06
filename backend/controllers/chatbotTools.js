const { DynamicTool } = require("@langchain/core/tools");
const doctorController = require("./doctorController");

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

const getAppointmentTool = new DynamicTool({
  name: "get_appointment",
  description: 'Gets the appointment details for a specific doctor. \
  Input: doctor email. \
  Output: a list of appointments, which includes: name, email, time, and health details of each of their upcoming appointments.',
  func: async (email) => {
    // Simulate fetching appointment details
    const url = `${API_BASE_URL}/doctors/appointments/${email}`;
    try {
      const response = await fetchClient(url, { method: "GET" });
      console.log("Fetched appointments:", response);

      if (!response.appointments || response.appointments.length === 0) {
        return "No appointments found for this doctor, or there was an issue retrieving them.";
      }

      return JSON.stringify(response.appointments, null, 2); // Pretty print JSON
      
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
      return "Error fetching doctor appointments: " + error.toString();
    }
  },
});

// Create tools array
const tools = [getAppointmentTool];

module.exports = tools;