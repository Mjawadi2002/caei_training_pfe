import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const [expandedFormation, setExpandedFormation] = useState(null);
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
        toast.success('Enrollment created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error registering for formation:', error.response?.data || error.message);
      toast.error('Failed to register for the formation.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const toggleDetails = (formationId) => {
    setExpandedFormation(expandedFormation === formationId ? null : formationId);
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
                  {expandedFormation === formation.id && (
                    <div className="formation-details">
                      <p className="card-text">
                        <strong>Price:</strong> {formation.price} TND
                      </p>
                      <p className="card-text">
                        <strong>Category:</strong> {formation.category}
                      </p>
                      <p className="card-text">
                        <strong>Tags:</strong> {formation.tags}
                      </p>
                      <p className="card-text">
                        <strong>Session begins:</strong> {new Date(formation.session_deb).toLocaleDateString()}
                      </p>
                      <p className="card-text">
                        <strong>Session ends:</strong> {new Date(formation.session_end).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <button
                      className="btn btn-success me-2"
                      onClick={() => toggleDetails(formation.id)}
                    >
                      {expandedFormation === formation.id ? 'Hide Details' : 'Details'}
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleRegister(formation.id)}
                    >
                      Register
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
      <ToastContainer />
    </div>
  );
}
