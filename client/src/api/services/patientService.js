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