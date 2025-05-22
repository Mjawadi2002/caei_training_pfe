import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Spinner,
  Alert,
  Container,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { FaStar } from "react-icons/fa"; // For star icons

export default function Evaluations() {
  const { state } = useLocation();
  const formationId = state?.formationId;
  const formationName = state?.formationName;
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentEvalId, setCurrentEvalId] = useState(null);
  const [newRating, setNewRating] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (formationId) {
      fetchEvaluations();
    } else {
      setError("Formation ID is missing.");
      setLoading(false);
    }
  }, [formationId, fetchEvaluations]);

  const fetchEvaluations = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:5000/api/v1/enrollment/evaluations/${formationId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvaluations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch evaluations.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRating = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/enrollment/evaluations/${currentEvalId}`,
        { rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvaluations();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update rating.");
    }
  };

  const openModal = (evalId, currentRating) => {
    setCurrentEvalId(evalId);
    setNewRating(currentRating || 1);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4">
          Evaluations for Course {formationName} :
        </h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : evaluations.length > 0 ? (
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-dark text-white">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date Enrolled</th>
                <th>Rating</th>
                <th>Enrollment ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evalItem) => (
                <tr key={evalItem._id}>
                  <td>{evalItem.name}</td>
                  <td>{evalItem.email}</td>
                  <td>
                    {new Date(evalItem.date_enrolled).toLocaleDateString()}
                  </td>
                  <td>
                    {evalItem.rating ? (
                      [...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < evalItem.rating ? "#ffc107" : "#e4e5e9"}
                        />
                      ))
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{evalItem.enrollment_id}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() =>
                        openModal(evalItem.enrollment_id, evalItem.rating)
                      }
                    >
                      <FaStar />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No one enrolled for this course yet.</p>
        )}
      </Card>

      {/* Modal for updating rating */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="rating">
              <Form.Label>Select Rating</Form.Label>
              <Form.Control
                as="select"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleUpdateRating}>
            Save Rating
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
