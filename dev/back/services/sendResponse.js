const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

/**
 * 
 * @param {string} recipientEmail - 
 * @param {string} message - 
 * @returns {Promise} - 
 */
const sendResponseEmail = (recipientEmail, message) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: "Response to Your Réclamation",
      text: message,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email sending error:", err);
        reject("Failed to send email");
      } else {
        console.log("Email sent:", info.response);
        resolve("Email sent successfully");
      }
    });
  });
};

module.exports = sendResponseEmail;
