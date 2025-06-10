import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Card, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    category: "",
    tags: "",
    image_path: "/uploads/formations/default-formation.png"
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      toast.success('Formation deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete formation.");
      toast.error(err.response?.data?.error || "Failed to delete formation.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleShow = (formation = null) => {
    setCurrentFormation(formation);
    setFormData(
      formation
        ? {
            ...formation,
            session_deb: formatDate(formation.session_deb),
            session_end: formatDate(formation.session_end)
          }
        : {
            title: "",
            description: "",
            price: "",
            category: "",
            tags: "",
            session_deb: "",
            session_end: "",
            formateur_id: "",
            image_path: "/uploads/formations/default-formation.png"
          }
    );
    setSelectedFile(null);
    setImagePreview(formation ? `http://localhost:5000${formation.image_path}` : null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentFormation(null);
    setFormData({ title: "", description: "", price: "", category: "", tags: "", session_deb: "", session_end: "", formateur_id: "", image_path: "/uploads/formations/default-formation.png" });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentFormation) {
      updateFormation();
    } else {
      createFormation();
    }
  };

  const createFormation = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('session_deb', formData.session_deb);
      formDataToSend.append('session_end', formData.session_end);
      formDataToSend.append('formateur_id', formData.formateur_id);
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('tags', typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(tag => tag.trim())
        : formData.tags ? formData.tags.map(tag => tag.trim()) : []);
      
      if (selectedFile) {
        formDataToSend.append('formationImage', selectedFile);
      }

      const response = await axios.post("http://localhost:5000/api/v1/formations", formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.data.image_path) {
        setFormData(prev => ({ ...prev, image_path: response.data.image_path }));
      }

      fetchFormations();
      handleClose();
      toast.success('Formation created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create formation.");
      toast.error(err.response?.data?.error || "Failed to create formation.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const updateFormation = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('session_deb', formData.session_deb);
      formDataToSend.append('session_end', formData.session_end);
      formDataToSend.append('formateur_id', formData.formateur_id);
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('tags', formData.tags.split(",").map(tag => tag.trim()));
      formDataToSend.append('image_path', formData.image_path);
      
      if (selectedFile) {
        formDataToSend.append('formationImage', selectedFile);
      }

      const response = await axios.put(`http://localhost:5000/api/v1/formations/${currentFormation.id}`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.data.image_path) {
        setFormData(prev => ({ ...prev, image_path: response.data.image_path }));
      }
      
      fetchFormations();
      handleClose();
      toast.success('Formation updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update formation.");
      toast.error(err.response?.data?.error || "Failed to update formation.", {
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
    <Container className="mt-4" style={{ maxWidth: "95%" }}>
      <ToastContainer />
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
                <th>Image</th>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Session Start</th>
                <th>Session End</th>
                <th>Formateur ID</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formations.length > 0 ? (
                formations.map((formation) => (
                  <tr key={formation.id}>
                    <td>
                      <img 
                        src={`http://localhost:5000${formation.image_path}`} 
                        alt={formation.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{formation.id}</td>
                    <td>{formation.title}</td>
                    <td>{formation.description}</td>
                    <td>{formation.price} TND</td>
                    <td>{new Date(formation.session_deb).toLocaleDateString()}</td>
                    <td>{new Date(formation.session_end).toLocaleDateString()}</td>
                    <td>{formation.formateur_id}</td>
                    <td>{formation.category}</td>
                    <td>{formation.tags}</td>
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
                  <td colSpan="11">No formations found.</td>
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

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentFormation ? "Edit Formation" : "Add New Formation"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Formation Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {(imagePreview || formData.image_path) && (
                <div className="mt-2">
                  <img
                    src={imagePreview || `http://localhost:5000${formData.image_path}`}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                    className="img-thumbnail"
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="formFormationTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationPrice">
              <Form.Label>Price (TND)</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control type="text" name="tags" value={formData.tags} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formFormationSessionStart">
              <Form.Label>Session Start</Form.Label>
              <Form.Control
                type="date"
                name="session_deb"
                value={formData.session_deb}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFormationSessionEnd">
              <Form.Label>Session End</Form.Label>
              <Form.Control
                type="date"
                name="session_end"
                value={formData.session_end}
                onChange={handleChange}
                required
              />
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
