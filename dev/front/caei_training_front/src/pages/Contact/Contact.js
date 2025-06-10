import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaPaperPlane } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../Register/Register.css";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const res = await axios.post("http://localhost:5000/api/v1/email/send-email", formData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (res.data.success) {
        toast.success(res.data.message || "Message envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(res.data.message || "Échec de l'envoi du message.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Échec de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container fade-in">
      <div className="register-form-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Contactez-nous</h2>

          <div className="form-group">
            <input
              type="text"
              className="form-control input-icon-user"
              name="name"
              placeholder="Votre Nom"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className="form-control input-icon-email"
              name="email"
              placeholder="Votre Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-control input-icon-message"
              name="message"
              placeholder="Votre Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-success btn-icon" disabled={loading}>
              {loading ? "Envoi en cours..." : <>Envoyer <FaPaperPlane /></>}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
    </div>
  );
}
