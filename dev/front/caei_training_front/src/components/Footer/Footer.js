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
      const response = await axios.post('http://localhost:5000/api/feedback', { message });
      setResponseMessage({ type: 'success', text: 'Merci pour votre retour !' });
      setMessage('');
    } catch (error) {
      setResponseMessage({ type: 'error', text: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' });
    }
    setLoading(false);
  };

  return (
    <>
      {location.pathname === "/" ? 
        <footer className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">Suivez-nous</h3>
              <div className="social-icons">
                <button className="social-link" aria-label="Facebook" onClick={() => window.open('https://www.facebook.com', '_blank')}>
                  <i className="bi bi-facebook"></i>
                </button>
                <a href="https://www.instagram.com/mouhanned_jaouedi/?hl=fr" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
                <button className="social-link" aria-label="LinkedIn" onClick={() => window.open('https://www.linkedin.com', '_blank')}>
                  <i className="bi bi-linkedin"></i>
                </button>
                <button className="social-link" aria-label="Twitter" onClick={() => window.open('https://twitter.com', '_blank')}>
                  <i className="bi bi-twitter-x"></i>
                </button>
                <button className="social-link" aria-label="YouTube" onClick={() => window.open('https://www.youtube.com', '_blank')}>
                  <i className="bi bi-youtube"></i>
                </button>
              </div>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Liens Rapides</h3>
              <ul className="footer-links">
                <li><a href="/formations">Tous les Cours</a></li>
                <li><a href="/about">À Propos</a></li>
                <li><a href="/contact">Besoin d'Aide</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Contactez-nous</h3>
              <div className="contact-info">
                <p><i className="bi bi-envelope-fill"></i> contact@caei-afri.com</p>
                <p><i className="bi bi-telephone-fill"></i> +216 55 332 885</p>
                <p><i className="bi bi-geo-alt-fill"></i> SIS 8 Rue Claude Bernard 1002 Belvedere-Tunis , Tunisie</p>
                <p><i className="bi bi-clock-fill"></i> Lun-Ven: 9h-18h</p>
              </div>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Retour d'Expérience</h3>
              {responseMessage && (
                <div className={`alert-message ${responseMessage.type}`}>
                  {responseMessage.text}
                </div>
              )}
              <form onSubmit={handleSubmit} className="feedback-form">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Votre retour nous aide à nous améliorer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
                <button className="btn btn-success" type="submit" disabled={loading}>
                  {loading ? <><i className="bi bi-arrow-repeat"></i> Envoi en cours...</> : <><i className="bi bi-send-fill"></i> Envoyer</>}
                </button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} CAEI Training. Tous droits réservés.</p>
          </div>
        </footer>
        : 
        <footer className="footer-simple">
          <p>© {new Date().getFullYear()} CAEI Training. Tous droits réservés.</p>
        </footer>
      } 
    </>
  );
}