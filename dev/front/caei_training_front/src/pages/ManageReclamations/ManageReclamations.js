import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Table, Button, Container, Card, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { FaReply, FaTrash } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageReclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentReclamation, setCurrentReclamation] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchReclamations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/email/allReclamations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReclamations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load réclamations.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReclamations();
  }, [fetchReclamations]);

  const deleteReclamation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this réclamation?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/email/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReclamations((prev) => prev.filter((rec) => rec.id !== id));
      toast.success('Réclamation deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete réclamation.");
      toast.error(err.response?.data?.message || "Failed to delete réclamation.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleShow = (reclamation) => {
    setCurrentReclamation(reclamation);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentReclamation(null);
    setResponseMessage("");
  };

  const handleResponseChange = (e) => {
    setResponseMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/v1/email/respond/${currentReclamation.id}`, {
        message: responseMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReclamations();
      handleClose();
      toast.success('Response sent successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send response.");
      toast.error(err.response?.data?.message || "Failed to send response.", {
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
        <h2 className="text-center mb-4">Manage Réclamations</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-dark text-white">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reclamations.length > 0 ? (
                reclamations.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.id}</td>
                    <td>{rec.nom}</td>
                    <td>{rec.email}</td>
                    <td>{rec.message}</td>
                    <td>
                      {rec.responded ? (
                        <BsCircleFill color="green" title="Responded" />
                      ) : (
                        <BsCircleFill color="red" title="Pending" />
                      )}
                    </td>
                    <td>
                      <Button variant="info" size="sm" className="me-2" onClick={() => handleShow(rec)}>
                        <FaReply /> Respond
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteReclamation(rec.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">No réclamations found.</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Respond to Réclamation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>From:</strong> {currentReclamation?.nom} ({currentReclamation?.email})</p>
          <p><strong>Message:</strong> {currentReclamation?.message}</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="responseMessage">
              <Form.Label>Response</Form.Label>
              <Form.Control as="textarea" rows={3} value={responseMessage} onChange={handleResponseChange} required />
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">Send Response</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
