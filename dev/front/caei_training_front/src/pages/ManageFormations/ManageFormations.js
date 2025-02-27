import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Card, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function ManageFormations() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentFormation, setCurrentFormation] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    session_deb: "",
    session_end: "",
    formateur_id: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/formations");
      setFormations(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load formations.");
    } finally {
      setLoading(false);
    }
  };

  const deleteFormation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this formation?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/formations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormations((prev) => prev.filter((formation) => formation.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete formation.");
    }
  };

  const handleShow = (formation = null) => {
    setCurrentFormation(formation);
    setFormData(
      formation
        ? { ...formation }
        : { title: "", description: "", price: "", session_deb: "", session_end: "", formateur_id: "" }
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
      } else {
        await axios.post("http://localhost:5000/api/v1/formations", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchFormations();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed.");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4">Manage Formations</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-dark text-white">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Session Start</th>
                <th>Session End</th>
                <th>Formateur ID</th>
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
                    <td>{formation.price} USD</td>
                    <td>{new Date(formation.session_deb).toLocaleDateString()}</td>
                    <td>{new Date(formation.session_end).toLocaleDateString()}</td>
                    <td>{formation.formateur_id}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(formation)}>
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteFormation(formation.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No formations found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        <div className="text-center mt-3">
          <Button variant="success" size="lg" onClick={() => handleShow()}>
            <FaPlus /> Add Formation
          </Button>
        </div>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentFormation ? "Edit Formation" : "Add New Formation"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFormationTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationPrice">
              <Form.Label>Price (USD)</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationSessionStart">
              <Form.Label>Session Start</Form.Label>
              <Form.Control type="date" name="session_deb" value={formData.session_deb} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationSessionEnd">
              <Form.Label>Session End</Form.Label>
              <Form.Control type="date" name="session_end" value={formData.session_end} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationFormateurId">
              <Form.Label>Formateur ID</Form.Label>
              <Form.Control type="text" name="formateur_id" value={formData.formateur_id} onChange={handleChange} required />
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              {currentFormation ? "Save Changes" : "Add Formation"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
