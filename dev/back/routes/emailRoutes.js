// routes/emailRoutes.js
const express = require("express");
const sendEmail = require("../services/sendEmail"); // Keep the email service import
const sendFeedback = require("../services/sendFeedback"); // Corrected import for feedback service
const router = express.Router();

// Route for sending emails
router.post("/send-email", async (req, res) => {
  const { name, subject, message } = req.body;

  if (!name || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const response = await sendEmail(name, subject, message);
  res.status(response.success ? 200 : 500).json(response);
});

// Route for sending feedback
router.post("/send-feedback", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }

  const response = await sendFeedback(message);
  res.status(response.success ? 200 : 500).json(response);
});

module.exports = router;
