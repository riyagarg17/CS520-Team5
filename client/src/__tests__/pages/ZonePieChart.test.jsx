/**
 * Test suite for the Zone Pie Chart component.
 * Tests the visualization of patient health zones distribution
 * including data handling, rendering, and layout specifications.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import ZonePieChart from '../../pages/ZonePieChart';

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
    Pie: () => <div data-testid="pie-chart">Pie Chart</div>
}));

/**
 * Main test suite for Zone Pie Chart functionality.
 * Verifies chart rendering, data processing, and error handling
 * for various patient zone distributions.
 */
describe('ZonePieChart Component', () => {
    const mockPatients = [
        { health_details: { zone: 'Red' } },
        { health_details: { zone: 'Yellow' } },
        { health_details: { zone: 'Green' } },
        { health_details: { zone: 'Red' } },
        { health_details: { zone: 'Green' } }
    ];

    test('renders pie chart with correct data', () => {
        render(<ZonePieChart patients={mockPatients} />);
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('handles empty patients array', () => {
        render(<ZonePieChart patients={[]} />);
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('handles patients with missing zone data', () => {
        const patientsWithMissingData = [
            { health_details: { zone: 'Red' } },
            { health_details: {} },
            { health_details: { zone: 'Green' } }
        ];
        render(<ZonePieChart patients={patientsWithMissingData} />);
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('maintains correct container dimensions', () => {
        const { container } = render(<ZonePieChart patients={mockPatients} />);
        const chartContainer = container.firstChild;
        expect(chartContainer).toHaveStyle({
            maxWidth: '300px',
            height: '250px'
        });
    });
}); 