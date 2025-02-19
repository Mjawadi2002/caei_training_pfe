import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Spinner, Button, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./User.css"; // Import your custom CSS for animations

export default function User() {
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });

    // Static formations data with descriptions
    const formations = [
        { id: 1, name: "Formation 1", description: "This is a detailed description of Formation 1." },
        { id: 2, name: "Formation 2", description: "This is a detailed description of Formation 2." },
        { id: 3, name: "Formation 3", description: "This is a detailed description of Formation 3." },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            axios
                .get(`http://localhost:5000/api/v1/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data) {
                        setUserId(response.data.id);
                        setUserName(response.data.name);
                        setUserEmail(response.data.email);
                        setUserRole(response.data.role);
                        setFormData({ name: response.data.name, email: response.data.email });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
    
        if (!userId) {
            console.error("User ID is not available.");
            return;
        }
    
        console.log("Updating user:", userId, formData); // Debugging
    
        axios
            .put(`http://localhost:5000/api/v1/users/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("User updated successfully:", response.data);
                setUserName(formData.name);
                setUserEmail(formData.email);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            })
            .finally(() => {
                handleClose();
            });
    };
    

    return (
        <div className="container mt-5 fade-in">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg rounded-lg p-4 mb-4">
                        <div className="card-body text-center">
                            <h1 className="display-4 text-black">
                                Welcome {userName ? userName : "User"}!
                            </h1>

                            {loading ? (
                                <div className="mt-4">
                                    <Spinner animation="border" role="status" />
                                    <span className="ml-2">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    <p className="lead text-muted mt-4">
                                        <strong>Name:</strong> {userName || "N/A"}
                                    </p>
                                    <p className="lead text-muted">
                                        <strong>Email:</strong> {userEmail || "N/A"}
                                    </p>
                                    <p className="lead text-muted">
                                        <strong>Role:</strong> {userRole || "N/A"}
                                    </p>
                                    <Button variant="success" onClick={handleShow}>
                                        Edit Info
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <h3 className="display-6 text-center">Enrolled Formations</h3>
                    <div className="row">
                        {formations.map((formation) => (
                            <div key={formation.id} className="col-md-4 mb-4">
                                <div className="card formation-card">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">{formation.name}</h5>
                                        <p className="card-text">{formation.description}</p>
                                        <Button variant="success">View Details</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUserName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formUserEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
