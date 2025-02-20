import React, { useState } from "react";
import axios from "axios";
import "../Register/Register.css";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    try {
      const res = await axios.post("http://localhost:5000/api/v1/email/send-email", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setResponseMessage({ type: "success", text: res.data.message });
      setFormData({ name: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setResponseMessage({ type: "error", text: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container fade-in">
      <div className="register-form-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Contact Us</h2>

          {responseMessage && (
            <div className={`alert ${responseMessage.type === "success" ? "alert-success" : "alert-danger"}`}>
              {responseMessage.text}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-control"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
