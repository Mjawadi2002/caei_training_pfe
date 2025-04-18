const OpenAI = require('openai');
const mysqlPool = require('../config/db'); // Adjust path as needed

class FreeChatbot {
  constructor() {
    this.client = new OpenAI({
      baseURL: "https://api.together.xyz/v1",
      apiKey: process.env.TOGETHER_API_KEY || "your-free-api-key",
    });
  }

  async getFormationsData() {
    return new Promise((resolve, reject) => {
      mysqlPool.query(`
        SELECT 
          title,
          description,
          CAST(price AS CHAR) as price,
          DATE_FORMAT(session_deb, '%Y-%m-%d') as start_date,
          DATE_FORMAT(session_end, '%Y-%m-%d') as end_date,
          category
        FROM formations
        WHERE session_end >= CURDATE()
        ORDER BY session_deb ASC
      `, (error, results) => {
        if (error) {
          console.error('Database error:', error);
          reject(error);
        } else {
          // Convert all values to strings
          const stringResults = results.map(item => ({
            title: String(item.title),
            description: String(item.description || 'No description available'),
            price: String(item.price || 'Price not specified'),
            start_date: String(item.start_date),
            end_date: String(item.end_date),
            category: String(item.category || 'General')
          }));
          resolve(stringResults);
        }
      });
    });
  }

  async chat(messages) {
    const systemPrompt = {
      role: "system",
      content: `You are a CAEI TRAINING assistant with access to current course data. Follow these rules:
      
1. ONLY answer questions about:
   - Available formations (courses)
   - Course content and descriptions
   - Pricing and schedules
   - Registration information

2. For unrelated questions, respond:
   "I specialize in CAEI training programs. How can I help you with our courses?"

3. Current Formations Data:
${JSON.stringify(await this.getFormationsData(), null, 2)}

4. Response Guidelines:
   - Use exact course titles from the data
   - Format prices as: "The [title] costs [price]"
   - For schedules: "Runs from [start_date] to [end_date]"
   - Never invent information not in the data`
    };

    try {
      const response = await this.client.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 512
      });

      return {
        role: "assistant",
        content: response.choices[0]?.message?.content?.trim() || 
               "I couldn't retrieve that information. Please try again."
      };
    } catch (error) {
      console.error("Chatbot error:", error);
      return {
        role: "assistant",
        content: "Our system is currently unavailable. Please contact support for assistance."
      };
    }
  }
}

module.exports = new FreeChatbot();