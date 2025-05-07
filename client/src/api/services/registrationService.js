import fetchClient from "../client";
import { ENDPOINTS } from "../endpoint";

// const updateLocation = async (url, email, location_obj) => {
//     const request = {
//         email,
//         location: {
//             name: location_obj.label,
//             lat: location_obj.location.lat,
//             lon: location_obj.location.lon,
//             plus_code: location_obj.plus_code,
//         },
//     };
//     return fetchClient(url, {
//         method: "POST",
//         body: JSON.stringify(request),
//     });
// };

// export const updatePatientLocation = async (email, location) => {
//     try {
//         const url = ENDPOINTS.setPatientLocation();
//         return updateLocation(url, email, location);
//     } catch (error) {
//         throw error;
//     }
// };

// export const updateDoctorLocation = async (email, location) => {
//     try {
//         const url = ENDPOINTS.setDoctorLocation();
//         return updateLocation(url, email, location);
//     } catch (error) {
//         throw error;
//     }
// };

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
  
