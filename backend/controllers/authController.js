const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Patient = require("../models/patient");


const loginDoctor = async (Model, req, res) => {
  console.log("login doctor: ", req.body)
  const {  password ,email} = req.body;
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

exports.loginDoctor = (req, res) => loginDoctor(Doctor, req, res);


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