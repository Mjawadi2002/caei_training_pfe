const chatbotService = require("../services/chatbotService");

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await chatbotService.chat(messages);
    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};