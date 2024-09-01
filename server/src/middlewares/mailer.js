// mailer.js
const nodemailer = require("nodemailer");

const sendEmail = async (recipientEmail, subject, text, html) => {
  try {
    // Create a transporter object with your email service configurations
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., Gmail, Yahoo, Outlook (or use a custom service)
      auth: {
        user: process.env.EMAIL_USER, // Email account to send from (setup in your .env)
        pass: process.env.EMAIL_PASS, // Password or app-specific password (setup in your .env)
      },
    });

    // Email details
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: recipientEmail, // Receiver's email
      subject: subject, // Email subject
      text: text, // Plain text body
      html: html, // HTML body (optional)
    };

    // Send email 
    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendEmail;
