import { useState } from "react";
import "./Card.css";
import { FaTimes } from "react-icons/fa";

export default function Card({ image, title, text, description, icon }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="card shadow-sm border-0 rounded-3 transition-all hover-shadow-lg hover-transform-up">
                <img src={image} className="card-img-top" alt={title} />
                <div className="card-body text-center">
                    <div className="icon mb-3">
                        {icon}
                    </div>
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{text}</p>
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>Détails</button>
                </div>
            </div>

            {/* Modal Popup */}
            {showModal && (
                <div className="modal" onClick={() => setShowModal(false)}>
                    <div className="modal-content">
                        <span className="close-btn" onClick={() => setShowModal(false)}><FaTimes /></span>
                        <h4>{title}</h4>
                        <p>{description}</p>
                    </div>
                </div>
            )}
        </>
    );
}
