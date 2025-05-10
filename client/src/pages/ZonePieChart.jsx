import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ZonePieChart = ({ patients }) => {
    // Calculate zone distribution from patients data
    const zoneCounts = patients.reduce((acc, patient) => {
        const zone = patient.health_details?.zone || 'Unknown';
        acc[zone] = (acc[zone] || 0) + 1;
        return acc;
    }, { Red: 0, Yellow: 0, Green: 0 });

    const data = {
        labels: ["Red", "Yellow", "Green"],
        datasets: [
            {
                label: "Patients",
                data: [zoneCounts.Red, zoneCounts.Yellow, zoneCounts.Green],
                backgroundColor: ["#ff4d4f", "#faad14", "#52c41a"],
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 10
                }
            }
        }
    };

    return (
        <div style={{ 
            maxWidth: 300, 
            margin: "0 auto",
            height: 250,
            padding: "10px"
        }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default ZonePieChart;
