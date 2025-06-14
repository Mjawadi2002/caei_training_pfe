import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Container, Card, Button, Modal, Form } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Formateur() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentFormation, setCurrentFormation] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", price: "", session_deb: "", session_end: "" });

  const token = localStorage.getItem("token");
  let id = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      id = decodedToken.id;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const fetchFormations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/formations/formateur/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load formations.");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (id) {
      fetchFormations();
    } else {
      setError("Invalid or missing token.");
      setLoading(false);
    }
  }, [id, fetchFormations]);

  const deleteFormation = async (formationId) => {
    if (!window.confirm("Are you sure you want to delete this formation?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/formations/${formationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormations((prev) => prev.filter((formation) => formation.id !== formationId));
      toast.success('Formation deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete formation.");
      toast.error(err.response?.data?.message || "Failed to delete formation.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleShow = (formation = null) => {
    setCurrentFormation(formation);
    setFormData(
      formation
        ? { ...formation }
        : { title: "", description: "", price: "", session_deb: "", session_end: "" }
    );
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentFormation(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFormation) {
        await axios.put(`http://localhost:5000/api/v1/formations/${currentFormation.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Formation updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      fetchFormations();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
      toast.error(err.response?.data?.message || "Operation failed.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Container className="mt-5">
      <ToastContainer />
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4">My Proposed Courses</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-dark text-white">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formations.length > 0 ? (
                formations.map((formation) => (
                  <tr key={formation.id}>
                    <td>{formation.id}</td>
                    <td>{formation.title}</td>
                    <td>{formation.description}</td>
                    <td>{formation.price} TND</td>
                    <td>{new Date(formation.session_deb).toLocaleDateString()}</td>
                    <td>{new Date(formation.session_end).toLocaleDateString()}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(formation)}>
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteFormation(formation.id)}>
                        <FaTrash />
                      </Button>
                      <Link to={`/formateur/evaluation`} state={{ formationId: formation.id ,formationName:formation.title}} className="btn btn-success btn-sm ms-2">
                        Ratings
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7">No formations found.</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentFormation ? "Edit Formation" : "Add New Formation"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" name="session_deb" value={formData.session_deb} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" name="session_end" value={formData.session_end} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
