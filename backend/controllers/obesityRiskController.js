import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const predictObesityRisk = async (req, res) => {
    try {
        const healthData = req.body;
        const pythonProcess = spawn(join(__dirname, '../venv/bin/python3'), [join(__dirname, '../obesity_model.py')]);
        let result = '';
        let error = '';

        pythonProcess.stdin.write(JSON.stringify(healthData));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        await new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Python process exited with code ${code}: ${error}`));
                    return;
                }
                try {
                    const prediction = JSON.parse(result);
                    resolve(prediction);
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${e.message}`));
                }
            });
        });

        const prediction = JSON.parse(result);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 