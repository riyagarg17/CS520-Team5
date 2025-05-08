const { spawn } = require('child_process');
const path = require('path');

const predictRisk = (healthData) => {
    return new Promise((resolve, reject) => {
        console.log("Starting prediction with data:", healthData);
        
        // Create a Python process using the virtual environment
        const pythonProcess = spawn(path.join(__dirname, '../../venv/bin/python3'), [
            path.join(__dirname, 'predict.py'),
            JSON.stringify(healthData)
        ]);

        let result = '';
        let error = '';

        // Collect data from script
        pythonProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log("Python stdout:", output);
            result += output;
        });

        pythonProcess.stderr.on('data', (data) => {
            const errorOutput = data.toString();
            console.error("Python stderr:", errorOutput);
            error += errorOutput;
        });

        // Handle process completion
        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            
            if (code !== 0) {
                reject(new Error(`Python process failed: ${error}`));
                return;
            }
            
            try {
                // Get the last line of output which should be the prediction
                const prediction = parseInt(result.trim().split('\n').pop());
                console.log("Parsed prediction:", prediction);
                
                // Map prediction to zone colors
                const zoneMap = {
                    0: 'Green',  // Low risk (healthy values)
                    1: 'Yellow', // Medium risk
                    2: 'Red'     // High risk
                };
                
                const zone = zoneMap[prediction];
                if (!zone) {
                    throw new Error(`Invalid prediction value: ${prediction}`);
                }
                
                console.log("Mapped to zone:", zone);
                resolve(zone);
            } catch (err) {
                console.error("Error processing prediction:", err);
                reject(new Error(`Failed to process prediction: ${err.message}`));
            }
        });
    });
};

module.exports = { predictRisk }; 