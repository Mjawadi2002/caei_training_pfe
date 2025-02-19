import { useState } from "react";
import "./Card.css";

export default function Card({ image, title, text, description }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="card" style={{ width: '18rem' }}>
                <img src={image} className="card-img-top" alt={title} />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{text}</p>
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>Learn More</button>
                </div>
            </div>

            {/* Modal Popup */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <button className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}
