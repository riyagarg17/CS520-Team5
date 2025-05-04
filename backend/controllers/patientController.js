import Patient from '../models/Patient.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Create a new patient
export const createPatient = async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all patients
export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single patient by ID
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a patient
export const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a patient
export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generate MFA for a patient
export const generateMFA = async (req, res) => {
    try {
        const { userId } = req.body;
        const patient = await Patient.findById(userId);
        
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `CareCompass:${patient.email}`
        });

        // Generate backup codes
        const backupCodes = Array.from({ length: 8 }, () => 
            Math.random().toString(36).substring(2, 8).toUpperCase()
        );

        // Update patient with MFA details
        patient.mfaSecret = secret.base32;
        patient.mfaBackupCodes = backupCodes;
        await patient.save();

        // Generate QR code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        res.json({
            secret: secret.base32,
            qrCode,
            backupCodes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify MFA token
export const verifyMFA = async (req, res) => {
    try {
        const { userId, token } = req.body;
        const patient = await Patient.findById(userId);
        
        if (!patient || !patient.mfaSecret) {
            return res.status(404).json({ error: 'MFA not set up for this patient' });
        }

        // Check backup codes first
        const backupCodeIndex = patient.mfaBackupCodes.indexOf(token);
        if (backupCodeIndex !== -1) {
            // Remove used backup code
            patient.mfaBackupCodes.splice(backupCodeIndex, 1);
            await patient.save();
            return res.json({ message: 'Backup code verified successfully' });
        }

        // Verify TOTP token
        const verified = speakeasy.totp.verify({
            secret: patient.mfaSecret,
            encoding: 'base32',
            token: token
        });

        if (!verified) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        res.json({ message: 'Token verified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle MFA
export const toggleMFA = async (req, res) => {
    try {
        const { userId, enable } = req.body;
        const patient = await Patient.findById(userId);
        
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        patient.mfaEnabled = enable;
        await patient.save();

        res.json({ 
            message: `MFA ${enable ? 'enabled' : 'disabled'} successfully`,
            mfaEnabled: patient.mfaEnabled
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 