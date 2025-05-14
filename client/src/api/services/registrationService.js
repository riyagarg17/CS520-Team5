/**
 * Registration service handling user registration for both doctors and patients.
 * Manages form data submission including file uploads for doctor licenses.
 */

import fetchClient from "../client";
import { ENDPOINTS } from "../endpoint";


export const registerPatient = async (patient) => {
    try {
        const url = ENDPOINTS.addPatient;
        return fetchClient(url, {
            method: "POST",
            body: JSON.stringify(patient),
        });
    } catch (error) {
        throw error;
    }
};

export const registerDoctor = async (values, licenseFile) => {
    try {
      const url = ENDPOINTS.addDoctor;
      console.log("FRONTEND ", licenseFile, values.license )
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("gender", values.gender);
      formData.append("dob", values.dob);
      formData.append("pincode", values.pincode);
      formData.append("experience", values.exp);
      formData.append("license", values.license[0].originFileObj);
  
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Doctor registration failed");
      }
  
      return data;
    } catch (error) {
      console.error("Register Doctor Error:", error);
      throw error;
    }
  };
  
