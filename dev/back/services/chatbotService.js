const { HuggingFaceInference } = require("@langchain/community/llms/hf");

class HuggingFaceChatbot {
  constructor() {
    this.model = new HuggingFaceInference({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      apiKey: process.env.HF_TOKEN 
    });
  }

  async chat(messages) {
    try {
      const prompt = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n') + `\nAssistant:`;
  
      const response = await this.model.invoke(prompt);
  
      return {
        role: "assistant",
        content: response.trim(),
      };
    } catch (error) {
      console.error("HF Chatbot error:", error);
      return {
        role: "assistant",
        content: "I'm currently unavailable. Please try again."
      };
    }
  }
  
}

module.exports = new HuggingFaceChatbot();