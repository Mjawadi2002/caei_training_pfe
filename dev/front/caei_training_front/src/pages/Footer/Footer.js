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
      setResponseMessage({ type: "error", text: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {location.pathname === "/" ? 
        <div className="container-fluid footer-container">
          <div className="row py-4">
            <div className="col-md-4 text-center">
              <h3 className="footer-title">Follow Us</h3>
              <div className="social-icons">
                <div className='row'>
                  <a href="#" className="social-link"><i className="bi bi-facebook"></i></a>
                </div>
                <div className='row'>
                  <a href="#" className="social-link"><i className="bi bi-instagram"></i></a>
                </div>
                <div className='row'>
                  <a href="#" className="social-link"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
              <footer className="text-center py-3">
        <p>© {new Date().getFullYear()} CAEI Training. All rights reserved.</p>
      </footer>
            </div>
            
            
            <div className="col-md-3 text-center">
              <h3 className="footer-title">Contact Us</h3>
              <p><i className="bi bi-envelope-fill"></i> contact@caei.com</p>
              <p><i className="bi bi-telephone-fill"></i> +123 456 789</p>
              <p><i className="bi bi-geo-alt-fill"></i> 123 Street, City, Country</p>
            </div>
            <div className="col-md-4 text-center">
              <h3 className="footer-title">Leave Feedback</h3>
              {responseMessage && (
                <div className={`alert ${responseMessage.type === "success" ? "alert-success" : "alert-danger"}`}>
                  {responseMessage.text}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Write your feedback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className='d-flex align-items-center'>
                  <button className="btn btn-success" type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        :  <footer className="text-center py-3">
        <p>© {new Date().getFullYear()} CAEI Training. All rights reserved.</p>
      </footer>
      } 
    </>
  );
}

/*here i used a ternary operator to render the copyright on any page except the landing page */
