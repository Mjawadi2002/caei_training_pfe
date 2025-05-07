import '../Footer/Footer.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLocation } from 'react-router-dom';
import React, { useState } from "react";
import axios from "axios";

export default function Footer() {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    try {
      const res = await axios.post("http://localhost:5000/api/v1/email/send-feedback", { message }, {
        headers: { "Content-Type": "application/json" },
      });
      setResponseMessage({ type: "success", text: res.data.message });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setResponseMessage({ type: "error", text: "Failed to send message. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {location.pathname === "/" ? 
        <footer className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">Follow Us</h3>
              <div className="social-icons">
                <a href="#" className="social-link" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://www.instagram.com/mouhanned_jaouedi/?hl=fr" className="social-link" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="/formations">All Courses</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Need Help</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Contact Us</h3>
              <div className="contact-info">
                <p><i className="bi bi-envelope-fill"></i> contact@caei.com</p>
                <p><i className="bi bi-telephone-fill"></i> +123 456 789</p>
                <p><i className="bi bi-geo-alt-fill"></i> 123 Education Street, Tech City</p>
                <p><i className="bi bi-clock-fill"></i> Mon-Fri: 9AM-5PM</p>
              </div>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Feedback</h3>
              {responseMessage && (
                <div className={`alert-message ${responseMessage.type}`}>
                  {responseMessage.text}
                </div>
              )}
              <form onSubmit={handleSubmit} className="feedback-form">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Your feedback helps us improve..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
                <button className="btn btn-success" type="submit" disabled={loading}>
                  {loading ? <><i className="bi bi-arrow-repeat"></i> Sending...</> : <><i className="bi bi-send-fill"></i> Send</>}
                </button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} CAEI Training. All rights reserved.</p>
          </div>
        </footer>
        : 
        <footer className="footer-simple">
          <p>© {new Date().getFullYear()} CAEI Training. All rights reserved.</p>
        </footer>
      } 
    </>
  );
}