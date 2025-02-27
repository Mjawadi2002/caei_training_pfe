const db=require('../config/db');
const express = require("express");
const sendEmail = require("../services/sendEmail"); 
const sendFeedback = require("../services/sendFeedback"); 
const sendResponseEmail=require('../services/sendResponse')
const router = express.Router();


router.post("/send-email", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const response = await sendEmail(name, email, message);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
});

router.get("/getCountOfReclamations", async (req, res) => {
  try {
    const sql = "SELECT COUNT(*) AS count FROM reclamations";
    const [rows] = await db.promise().query(sql); // Use promise-based query

    res.status(200).json({ success: true, count: rows[0].count });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/allReclamations", async (req, res) => {
  try {
    const sql = "SELECT id, nom, email, message, responded FROM reclamations";
    const [results] = await db.promise().query(sql); 
    res.status(200).json(results); 
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "DELETE FROM reclamations WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Reclamation not found" });
    }
    res.status(200).json({ success: true, message: "Reclamation deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.post("/respond/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Response message is required" });
  }

  try {
    const sqlSelect = "SELECT email FROM reclamations WHERE id = ?";
    const [results] = await db.promise().query(sqlSelect, [id]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Reclamation not found" });
    }

    const recipientEmail = results[0].email;

    await sendResponseEmail(recipientEmail, message);

    const sqlUpdate = "UPDATE reclamations SET responded = TRUE WHERE id = ?";
    await db.promise().query(sqlUpdate, [id]);

    res.status(200).json({ success: true, message: "Response sent successfully and status updated." });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



router.post("/send-feedback", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }

  const response = await sendFeedback(message);
  res.status(response.success ? 200 : 500).json(response);
});

module.exports = router;
