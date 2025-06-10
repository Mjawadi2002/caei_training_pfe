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
const sendResponseEmail = async (recipientEmail, message) => {
  try {
    const mailOptions = {
      from: `"CAEI Support" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Response to Your Réclamation",
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Response to Your Réclamation</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #666; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #888; font-size: 0.9em;">Thank you for your patience.</p>
          <p style="color: #888; font-size: 0.9em;">Best regards,<br>CAEI Support Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return "Email sent successfully";
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email: " + error.message);
  }
};

module.exports = sendResponseEmail;
