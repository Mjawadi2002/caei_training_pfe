const nodemailer = require("nodemailer");
const db = require("../config/db");
require("dotenv").config();

const sendEmail = async (name, email, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    let mailOptions = {
      from: `"Contact Form" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New reclamation from: ${name}`,
      text: `Message:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    
    const sql = "INSERT INTO reclamations (nom, email, message) VALUES (?, ?, ?)";
    try {
      await db.promise().query(sql, [name, email, message]);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return { success: false, message: "Email sent, but database save failed." };
    }

    return { success: true, message: "Message sent successfully." };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, message: "Failed to send message." };  // Return instead of throwing
  }
};


module.exports = sendEmail;
