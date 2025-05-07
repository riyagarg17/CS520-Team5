const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Patient = require("../models/patient");
const { sendOTP, verifyOTP } = require('../utils/emailService');
const { sendMFACode, verifyMFACode } = require('../utils/mfaService');

// Store temporary login data
const pendingLogins = new Map();

// Store temporary MFA tokens
const mfaTokens = new Map();

const loginDoctor = async (Model, req, res) => {
  console.log("login doctor: ", req.body)
  const { password, email } = req.body;
  try {
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status_code: 401,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status_code: 401,
        message: "Invalid email or password",
      });
    }

    // Generate MFA code and send it
    try {
      const mfaCode = await sendMFACode(email);
      const tempToken = jwt.sign(
        { email: user.email, type: 'doctor' },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );
      
      // Store token with email as key
      mfaTokens.set(email, tempToken);

      return res.status(200).json({
        status_code: 200,
        requiresMFA: true,
        message: "MFA code sent successfully",
        tempToken
      });
    } catch (error) {
      console.error("MFA Error:", error);
      return res.status(500).json({
        status_code: 500,
        message: "Failed to send MFA code",
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal server error",
    });
  }
};

const loginUser = async (Model, req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
  
    try {
      const user = await Model.findOne({ email });
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({
          status_code: 401,
          message: "Invalid email or password",
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Invalid password for:', email);
        return res.status(401).json({
          status_code: 401,
          message: "Invalid email or password",
        });
      }

      console.log('Password verified, sending MFA code to:', email);
      // Send MFA code
      await sendMFACode(email);
      console.log('MFA code sent successfully');

      // Generate temporary token for MFA verification
      const tempToken = jwt.sign(
        { userId: user._id, userType: Model === Patient ? 'patient' : 'doctor', email },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );

      mfaTokens.set(email, tempToken);
      console.log('Temporary token generated and stored');

      const response = {
        message: 'MFA code sent',
        email,
        requiresMFA: true
      };
      console.log('Sending response:', response);
      res.json(response);
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({
        status_code: 500,
        message: error.message || "Internal server error",
      });
    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (either patient or doctor)
    let user = await Patient.findOne({ email });
    let userType = 'patient';

    if (!user) {
      user = await Doctor.findOne({ email });
      userType = 'doctor';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Send MFA code
    await sendMFACode(email);

    // Generate temporary token for MFA verification
    const tempToken = jwt.sign(
      { userId: user._id, userType, email },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    mfaTokens.set(email, tempToken);

    res.json({
      message: 'MFA code sent',
      email,
      requiresMFA: true
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Verify OTP
    const isValid = verifyOTP(email, otp);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Get stored user data
    const loginData = pendingLogins.get(email);
    if (!loginData) {
      return res.status(401).json({ message: 'Login session expired' });
    }

    // Check if login attempt is expired (10 minutes)
    if (Date.now() - loginData.timestamp > 10 * 60 * 1000) {
      pendingLogins.delete(email);
      return res.status(401).json({ message: 'Login session expired' });
    }

    // Get user data
    const user = await User.findById(loginData.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Clear pending login
    pendingLogins.delete(email);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify MFA code
const verifyMFA = async (req, res) => {
  try {
    const { email, otp, tempToken } = req.body;
    console.log('Verifying MFA for:', email);

    // Verify OTP
    const isValid = await verifyMFACode(email, otp);
    if (!isValid) {
      console.log('Invalid OTP for:', email);
      return res.status(401).json({ message: 'Invalid or expired verification code' });
    }

    // Get temporary token
    const storedToken = mfaTokens.get(email);
    if (!storedToken) {
      console.log('No stored token found for:', email);
      return res.status(401).json({ message: 'Login session expired' });
    }

    // Verify and decode temporary token
    let decoded;
    try {
      decoded = jwt.verify(storedToken, process.env.JWT_SECRET);
    } catch (error) {
      console.log('Token verification failed:', error);
      return res.status(401).json({ message: 'Login session expired' });
    }

    // Get user data based on type
    let user;
    if (decoded.type === 'patient') {
      user = await Patient.findOne({ email });
    } else {
      user = await Doctor.findOne({ email });
    }

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate final JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        type: decoded.type
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Clean up
    mfaTokens.delete(email);

    // Remove password from user data
    const { password: _, ...userWithoutPassword } = user.toObject();

    console.log('MFA verification successful for:', email);
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ message: 'Error during verification' });
  }
};

// Resend MFA code
const resendMFA = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if there's a valid temporary token
    const tempToken = mfaTokens.get(email);
    if (!tempToken) {
      return res.status(401).json({ message: 'Login session expired' });
    }

    // Send new MFA code
    await sendMFACode(email);

    res.json({ message: 'New verification code sent' });
  } catch (error) {
    console.error('Resend MFA error:', error);
    res.status(500).json({ message: 'Error sending new code' });
  }
};

const register = async (req, res) => {
  // ... existing code ...
};

module.exports = {
  login,
  register,
  verifyMFA,
  resendMFA,
  loginPatient: (req, res) => loginUser(Patient, req, res),
  loginDoctor: (req, res) => loginDoctor(Doctor, req, res)
};