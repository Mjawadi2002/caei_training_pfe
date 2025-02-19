// services/sendFeedback.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendFeedback = async (message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER, // Use the email address from the environment variable
      to: process.env.EMAIL_USER,
      subject: "Feedback Received", // Optional: Add a subject for feedback emails
      text: `Message:\n${message}`, // Feedback message
    };

    await transporter.sendMail(mailOptions); // Use sendMail instead of sendFeedback
    return { success: true, message: "Feedback sent successfully." };
  } catch (error) {
    console.error("Feedback sending error:", error);
    return { success: false, message: "Failed to send feedback." };
  }
};

module.exports = sendFeedback;
