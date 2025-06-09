import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Table, Button, Container, Row, Col, Card, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { FaUserEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "", password: "" });
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchName, setSearchName] = useState("");

  const token = localStorage.getItem("token");

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/v1/users";

      if (selectedRole !== "all" && searchName) {
        url = `http://localhost:5000/api/v1/users?role=${selectedRole}&name=${searchName}`;
      } else if (selectedRole !== "all") {
        url = `http://localhost:5000/api/v1/users/role/${selectedRole}`;
      } else if (searchName) {
        url = `http://localhost:5000/api/v1/users/name/${searchName}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setClients(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  }, [selectedRole, searchName, token]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const deleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients((prev) => prev.filter((client) => client.id !== id));
      toast.success('Client deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete client.");
      toast.error(err.response?.data?.message || "Failed to delete client.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleShow = (client = null) => {
    setCurrentClient(client);
    setFormData(client ? { ...client, password: "" } : { name: "", email: "", role: "", password: "" });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentClient(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentClient) {
        await axios.put(`http://localhost:5000/api/v1/users/${currentClient.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Client updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        await axios.post("http://localhost:5000/api/v1/users", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Client created successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      fetchClients();
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
        <h2 className="text-center mb-4">Manage Clients</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mb-3">
          <Col md={6}>
            <Form.Select value={selectedRole} onChange={handleRoleChange}>
              <option value="all">All Roles</option>
              <option value="apprenant">Apprenant</option>
              <option value="agent">Agent</option>
              <option value="formateur">Formateur</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={handleSearchChange}
            />
          </Col>
        </Row>

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-dark text-white">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.role}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(client)}>
                        <FaUserEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteClient(client.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No clients found.</td></tr>
              )}
            </tbody>
          </Table>
        )}
        <Row className="mt-3">
          <Col className="text-center">
            <Button variant="success" size="lg" onClick={() => handleShow()}>
              <FaUserPlus /> Add Client
            </Button>
          </Col>
        </Row>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentClient ? "Edit User Info" : "Add New Client"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formUserRole">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="apprenant">Apprenant</option>
                <option value="agent">Agent</option>
                <option value="formateur">Formateur</option>
              </Form.Control>
            </Form.Group>
            {!currentClient && (
              <Form.Group controlId="formUserPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>
            )}
            <Button variant="success" type="submit" className="mt-3">
              {currentClient ? "Save Changes" : "Add Client"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
