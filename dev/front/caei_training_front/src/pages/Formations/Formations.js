import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Spinner, Alert, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Formations.css';

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [expandedFormation, setExpandedFormation] = useState(null);
  const navigate = useNavigate();

  const fetchFormations = useCallback(async () => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/v1/formations";

      if (selectedCategory !== "all" && searchTitle) {
        url = `http://localhost:5000/api/v1/formations/search?category=${selectedCategory}&title=${searchTitle}`;
      } else if (selectedCategory !== "all") {
        url = `http://localhost:5000/api/v1/formations/category/${selectedCategory}`;
      } else if (searchTitle) {
        url = `http://localhost:5000/api/v1/formations/title/${searchTitle}`;
      }

      const response = await axios.get(url);
      setFormations(response.data);
      
      // Extract unique categories from formations
      const uniqueCategories = [...new Set(response.data.map(formation => formation.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.response?.data?.error || "Échec du chargement des formations.");
      toast.error(err.response?.data?.error || "Échec du chargement des formations.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTitle]);

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTitle(e.target.value);
  };

  const handleEnroll = async (formationId) => {
    const token = localStorage.getItem("token");
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
        toast.success('Inscription réussie !', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription à la formation:', error.response?.data || error.message);
      toast.error('Échec de l\'inscription à la formation.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const toggleDetails = (formationId) => {
    setExpandedFormation(expandedFormation === formationId ? null : formationId);
  };

  return (
    <div className="container-fluid fade-in py-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Formations Disponibles</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="all">Toutes les Catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Rechercher par titre de formation"
            value={searchTitle}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : formations.length > 0 ? (
        <div className="row">
          {formations.map((formation) => (
            <div key={formation.id} className="col-md-4 mb-4">
              <div className="card formation-card">
                <div className="formation-image-container">
                  <img
                    src={`http://localhost:5000${formation.image_path}`}
                    alt={formation.title}
                    className="formation-image"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{formation.title}</h5>
                  <p className="card-text">{formation.description}</p>
                  {expandedFormation === formation.id && (
                    <div className="formation-details">
                      <p className="card-text">
                        <strong>Prix:</strong> {formation.price} TND
                      </p>
                      <p className="card-text">
                        <strong>Catégorie:</strong> {formation.category}
                      </p>
                      <p className="card-text">
                        <strong>Tags:</strong> {formation.tags}
                      </p>
                      <p className="card-text">
                        <strong>Début de session:</strong> {new Date(formation.session_deb).toLocaleDateString()}
                      </p>
                      <p className="card-text">
                        <strong>Fin de session:</strong> {new Date(formation.session_end).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div className="formation-actions">
                    <button
                      className="btn btn-info me-2"
                      onClick={() => toggleDetails(formation.id)}
                    >
                      {expandedFormation === formation.id ? 'Masquer les Détails' : 'Afficher les Détails'}
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleEnroll(formation.id)}
                    >
                      S'inscrire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Alert variant="info" className="text-center">
          Aucune formation ne correspond à vos critères.
        </Alert>
      )}
    </div>
  );
}
