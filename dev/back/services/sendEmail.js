const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (name, subject, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Request: ${subject}`,
      text: `From: ${name}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Message sent successfully." };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, message: "Failed to send message." };
  }
};

module.exports = sendEmail;
