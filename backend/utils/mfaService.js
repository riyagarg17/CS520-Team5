const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendMFACode = async (email) => {
  try {
    // Check if email configuration is set up
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
      throw new Error('Email service not configured');
    }

    const otp = generateOTP();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your CareCompass Login Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1890ff;">CareCompass Login Verification</h2>
          <p>Your verification code for logging into CareCompass is:</p>
          <h1 style="color: #52c41a; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${otp}</h1>
          <p>This code is valid for 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: 1px solid #f0f0f0; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `
    };

    // Verify transporter configuration
    await transporter.verify();
    console.log('Email configuration verified successfully');

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('MFA code sent successfully to:', email);
    
    // Store OTP with timestamp
    otpStore.set(email, {
      otp,
      timestamp: Date.now()
    });

    return true;
  } catch (error) {
    console.error('Error sending MFA code:', error);
    if (error.code === 'EAUTH') {
      throw new Error('Email service configuration error. Please check your email credentials.');
    }
    throw new Error('Failed to send verification code');
  }
};

// Verify OTP
const verifyMFACode = (email, otp) => {
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return false;
  }

  // Check if OTP is expired (5 minutes)
  if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
    otpStore.delete(email);
    return false;
  }

  // Check if OTP matches
  if (storedData.otp === otp) {
    otpStore.delete(email);
    return true;
  }

  return false;
};

module.exports = {
  sendMFACode,
  verifyMFACode
}; 