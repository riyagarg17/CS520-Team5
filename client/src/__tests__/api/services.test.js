import {
    getDoctorPatients,
    alertPatient
} from '../../api/services/doctorService';
import {
    updateHealthDetails,
    getPatientHealthDetails
} from '../../api/services/patientService';

// Mock fetchClient for all services
jest.mock('../../api/client', () => jest.fn());
const fetchClient = require('../../api/client');

// Mock fetch globally for getPatientHealthDetails
beforeAll(() => {
  global.fetch = jest.fn();
});
afterAll(() => {
  global.fetch.mockRestore && global.fetch.mockRestore();
});

describe('API Services', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getDoctorPatients', () => {
        const mockPatients = [
            { email: 'patient1@test.com', name: 'Patient One' },
            { email: 'patient2@test.com', name: 'Patient Two' }
        ];

        test('successfully fetches doctor patients', async () => {
            fetchClient.mockResolvedValueOnce({ body: mockPatients });

            const result = await getDoctorPatients('doctor@test.com');
            expect(result).toEqual({ body: mockPatients });
            expect(fetchClient).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ body: JSON.stringify({ email: 'doctor@test.com' }) })
            );
        });

        test('handles API error', async () => {
            fetchClient.mockRejectedValueOnce(new Error('API Error'));

            await expect(getDoctorPatients('doctor@test.com')).rejects.toThrow('API Error');
        });
    });

    describe('alertPatient', () => {
        test('successfully sends alert to patient', async () => {
            fetchClient.mockResolvedValueOnce({ message: 'Alert sent successfully' });

            const result = await alertPatient('patient@test.com', 'Patient Name');
            expect(result).toEqual({ message: 'Alert sent successfully' });
            expect(fetchClient).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ body: JSON.stringify({ email: 'patient@test.com', name: 'Patient Name' }) })
            );
        });

        test('handles API error', async () => {
            fetchClient.mockRejectedValueOnce(new Error('API Error'));

            await expect(alertPatient('patient@test.com', 'Patient Name')).rejects.toThrow('API Error');
        });
    });

    describe('updateHealthDetails', () => {
        const mockHealthDetails = {
            bloodGlucoseLevels: 120,
            bmi: 25,
            bloodPressure: '120/80',
            insulinDosage: 15
        };

        test('successfully updates health details', async () => {
            fetchClient.mockResolvedValueOnce({
                message: 'Health details updated',
                patient: { email: 'patient@test.com', health_details: mockHealthDetails },
                zone: 'Green'
            });

            const result = await updateHealthDetails('patient@test.com', mockHealthDetails);
            expect(result).toEqual({
                message: 'Health details updated',
                patient: { email: 'patient@test.com', health_details: mockHealthDetails },
                zone: 'Green'
            });
            expect(fetchClient).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ body: JSON.stringify({ email: 'patient@test.com', health_details: mockHealthDetails }) })
            );
        });

        test('handles API error', async () => {
            fetchClient.mockRejectedValueOnce(new Error('API Error'));

            await expect(updateHealthDetails('patient@test.com', mockHealthDetails))
                .rejects.toThrow('API Error');
        });
    });

    describe('getPatientHealthDetails', () => {
        const mockHealthDetails = {
            bloodGlucoseLevels: 120,
            bmi: 25,
            bloodPressure: '120/80',
            insulinDosage: 15,
            zone: 'Green'
        };

        test('successfully fetches health details', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ health_details: mockHealthDetails })
            });

            const result = await getPatientHealthDetails('patient@test.com');
            expect(result).toEqual(mockHealthDetails);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ body: JSON.stringify({ email: 'patient@test.com' }) })
            );
        });

        test('handles API error', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500
            });

            await expect(getPatientHealthDetails('patient@test.com')).rejects.toThrow('Failed to fetch health details: 500');
        });

        test('handles missing health details', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ health_details: null })
            });

            const result = await getPatientHealthDetails('patient@test.com');
            expect(result).toBeNull();
        });
    });
}); 