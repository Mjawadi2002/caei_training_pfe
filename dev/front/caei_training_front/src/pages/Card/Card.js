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
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>Learn More</button>
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

            <style jsx>{`
                .hover-transform-up {
                    transition: transform 0.3s ease;
                }
                .hover-transform-up:hover {
                    transform: translateY(-5px);
                }
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.5);
                }
                .modal-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 400px;
                    text-align: center;
                }
                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
            `}</style>
        </>
    );
}
