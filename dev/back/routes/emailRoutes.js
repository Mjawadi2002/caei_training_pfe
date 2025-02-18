const express = require("express");
const sendEmail = require("../services/sendEmail");
const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { name, subject, message } = req.body;

  if (!name || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const response = await sendEmail(name, subject, message);
  res.status(response.success ? 200 : 500).json(response);
});

module.exports = router;
