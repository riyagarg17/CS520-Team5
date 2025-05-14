// utils/sendEmail.js
const sgMail = require('@sendgrid/mail');


const sendEmail = async (to, subject, text) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to,
    from: process.env.SENDGRID_VERIFIED_SENDER,
    subject,
    text
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
  }
};


const sendAlertEmail = async (to, patientName) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: process.env.SENDGRID_VERIFIED_SENDER,
    subject: "Health Alert: Immediate Attention Required",
    html: `<p>Dear ${patientName},</p>
           <p>Your recent health metrics indicate that you are in the <strong style="color:red;">Red Zone</strong>. Please schedule a consultation as soon as possible.</p>
           <p>- CareCompass Team</p>`
  };

  try {
    await sgMail.send(msg);
    console.log("Alert email sent to:", to);
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendEmail, sendAlertEmail };
