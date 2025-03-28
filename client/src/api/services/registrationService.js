import fetchClient from "../client";
import { ENDPOINTS } from "../endpoint";

const updateLocation = async (url, email, location_obj) => {
    const request = {
        email,
        location: {
            name: location_obj.label,
            lat: location_obj.location.lat,
            lon: location_obj.location.lon,
            plus_code: location_obj.plus_code,
        },
    };
    return fetchClient(url, {
        method: "POST",
        body: JSON.stringify(request),
    });
};

export const updatePatientLocation = async (email, location) => {
    try {
        const url = ENDPOINTS.setPatientLocation();
        return updateLocation(url, email, location);
    } catch (error) {
        throw error;
    }
};

export const updateDoctorLocation = async (email, location) => {
    try {
        const url = ENDPOINTS.setDoctorLocation();
        return updateLocation(url, email, location);
    } catch (error) {
        throw error;
    }
};

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

export const registerDoctor = async (doctor) => {
    try {
        const url = ENDPOINTS.addDoctor;
        return fetchClient(url, {
            method: "POST",
            body: JSON.stringify(doctor),
        });
    } catch (error) {
        throw error;
    }
};