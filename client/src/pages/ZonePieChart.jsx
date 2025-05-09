import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ZonePieChart = () => {
    const data = {
        labels: ["Red", "Yellow", "Green"],
        datasets: [
            {
                label: "Patients",
                data: [2, 3, 5],
                backgroundColor: ["#ff4d4f", "#faad14", "#52c41a"],
                borderWidth: 1
            }
        ]
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <Pie data={data} />
        </div>
    );
};

export default ZonePieChart;
