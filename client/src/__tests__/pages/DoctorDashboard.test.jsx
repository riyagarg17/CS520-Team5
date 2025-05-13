import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DoctorDashboard from '../../pages/DoctorDashboard';
import { getDoctorPatients, alertPatient } from '../../api/services/doctorService';

// Mock the API services
jest.mock('../../api/services/doctorService', () => ({
    getDoctorPatients: jest.fn(),
    alertPatient: jest.fn()
}));

// Mock the ZonePieChart component
jest.mock('../../pages/ZonePieChart', () => () => <div data-testid="zone-pie-chart">Zone Chart</div>);

// Mock the useUserContext hook
const mockUser = {
    email: 'doctor@test.com',
    name: 'Dr. Test',
    role: 'doctor'
};
jest.mock('../../context/UserContext', () => ({
    useUserContext: () => ({ user: mockUser })
}));

describe('DoctorDashboard Component', () => {
    const mockPatients = [
        {
            email: 'patient1@test.com',
            name: 'Patient One',
            gender: 'Male',
            health_details: {
                zone: 'Red',
                bloodGlucoseLevels: 180,
                bmi: 28,
                bloodPressure: '140/90',
                insulinDosage: 20
            }
        },
        {
            email: 'patient2@test.com',
            name: 'Patient Two',
            gender: 'Female',
            health_details: {
                zone: 'Green',
                bloodGlucoseLevels: 100,
                bmi: 24,
                bloodPressure: '120/80',
                insulinDosage: 10
            }
        }
    ];

    beforeEach(() => {
        getDoctorPatients.mockResolvedValue({ body: mockPatients });
        alertPatient.mockResolvedValue({ message: 'Alert sent successfully' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('handles API error gracefully', async () => {
        getDoctorPatients.mockRejectedValue(new Error('API Error'));
        
        render(<DoctorDashboard />);

        await waitFor(() => {
            expect(screen.getByText('No patients found')).toBeInTheDocument();
        });
    });
}); 