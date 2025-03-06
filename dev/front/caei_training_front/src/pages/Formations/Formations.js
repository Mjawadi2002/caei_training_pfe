import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/formations')
      .then((response) => response.json())
      .then((data) => setFormations(data))
      .catch((error) => console.error('Error fetching formations:', error));
  }, []);

  const handleRegister = async (formationId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login page if the user is not authenticated
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const apprenantId = decodedToken.id;

      const response = await axios.post(
        'http://localhost:5000/api/v1/enrollment/',
        {
          apprenant_id: apprenantId,
          formation_id: formationId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert('Enrollment created successfully!');
      }
    } catch (error) {
      console.error('Error registering for formation:', error.response?.data || error.message);
      alert('Failed to register for the formation.');
    }
  };

  return (
    <div className="container-fluid fade-in">
      <div className="row">
        {formations.length > 0 ? (
          formations.map((formation) => (
            <div key={formation.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{formation.title}</h5>
                  <p className="card-text">{formation.description}</p>
                  <p className="card-text">
                    <strong>Price:</strong> {formation.price} TND
                  </p>
                  <p className="card-text">
                    <strong>Session begins:</strong> {formation.session_deb}
                  </p>
                  <p className="card-text">
                    <strong>Session ends:</strong> {formation.session_end}
                  </p>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleRegister(formation.id)}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No formations available</p>
        )}
      </div>
    </div>
  );
}