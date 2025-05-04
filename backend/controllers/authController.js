const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Patient = require("../models/patient");

// exports.register = async (req, res) => {
//     const { email, password, licenseNumber } = req.body;

//     try {
//         const existingDoctor = await Doctor.findOne({ email });
//         if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newDoctor = new Doctor({ email, password: hashedPassword, licenseNumber });
//         await newDoctor.save();

//         res.status(201).json({ message: 'Doctor registered successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Error registering doctor', error: err });
//     }
// };

// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const doctor = await Doctor.findOne({ email });
//         if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

//         const valid = await bcrypt.compare(password, doctor.password);
//         if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ id: doctor._id }, 'secretkey', { expiresIn: '1h' });
//         res.status(200).json({ token });
//     } catch (err) {
//         res.status(500).json({ message: 'Login failed', error: err });
//     }
// };

const loginUser = async (Model, req, res) => {
    const { email, password } = req.body;
  
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
      console.log("inside login backend: ", user)
      const { password: _, ...userWithoutPassword } = user.toObject();
  
      res.status(200).json({
        status_code: 200,
        body: userWithoutPassword,
        message: "Login successful",
      });
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({
        status_code: 500,
        message: "Internal server error",
      });
    }
  };
  
  exports.loginPatient = (req, res) => loginUser(Patient, req, res);