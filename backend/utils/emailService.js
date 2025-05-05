// utils/sendEmail.js
const sgMail = require('@sendgrid/mail');


const sendEmail = async (to, subject, text) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to,
    from: 'riyagarg8d@gmail.com', // You must verify this sender in SendGrid
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

module.exports = sendEmail;
