import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { Spinner, Button, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./User.css";

export default function User() {
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [enrolledFormations, setEnrolledFormations] = useState([]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [userImage, setUserImage] = useState("/default-profile.png");
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found in localStorage.");
            setLoading(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            setUserId(userId);

            // Fetch user details
            axios.get(`http://localhost:5000/api/v1/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    setUserName(response.data.name);
                    setUserEmail(response.data.email);
                    setUserRole(response.data.role);
                    setFormData({ name: response.data.name, email: response.data.email });
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error.response?.data || error.message);
                });

            // Fetch profile image
            axios.get(`http://localhost:5000/api/v1/users/${userId}/profile-image`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    setUserImage(response.data.profile_image_url || "/default-profile.png");
                })
                .catch((error) => {
                    console.error("Error fetching profile image:", error.response?.data || error.message);
                    setUserImage("/default-profile.png");
                });

        } catch (error) {
            console.error("Error decoding token:", error);
            setLoading(false);
        }
    }, [userImage]);



    useEffect(()=>{
        const token = localStorage.getItem("token");

        axios.get(`http://localhost:5000/api/v1/enrollment/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log("Enrolled Formations:", response.data);
                if (Array.isArray(response.data)) {
                    setEnrolledFormations(response.data);
                } else {
                    console.error("Enrolled formations data is not an array.");
                }
            })
            .catch((error) => {
                console.error("Error fetching enrolled formations:", error.response?.data || error.message);
            });

            axios.get(`http://localhost:5000/api/v1/enrollment/recommendations/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    console.log("Recommended Courses:", response.data);

                    // Check if recommendedCourses is an array and update state
                    if (Array.isArray(response.data.recommendedCourses)) {
                        setRecommendedCourses(response.data.recommendedCourses);
                    } else {
                        console.error("Recommended courses data is not an array:", response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching recommended courses:", error.response?.data || error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
    });


    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleImageModalClose = () => {
        setShowImageModal(false);
        setSelectedFile(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!userId) return;

        axios.put(`http://localhost:5000/api/v1/users/${userId}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                setUserName(formData.name);
                setUserEmail(formData.email);
                handleClose();
            })
            .catch((error) => {
                console.error("Error updating user:", error.response?.data || error.message);
            });
    };

    const handleLeaveFormation = (enrollmentId) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.delete(`http://localhost:5000/api/v1/enrollment/${enrollmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setEnrolledFormations(prev => prev.filter(f => f.enrollment_id !== enrollmentId));
            })
            .catch((error) => {
                console.error("Error deleting enrollment:", error.response?.data || error.message);
            });
    };

    const handleRegisterRecommendedCourse = async (courseId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/enrollment/',
                { apprenant_id: userId, formation_id: courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                alert('Registered for the course successfully!');
            }
        } catch (error) {
            console.error('Error registering for course:', error.response?.data || error.message);
            alert('Failed to register for the course.');
        }
    };

    const handleImageUpload = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleImageSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile || !userId) return;
    
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append('profileImage', selectedFile);
    
        try {
            const response = await axios.post(
                `http://localhost:5000/api/v1/users/${userId}/profile-image`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            if (response.data.imagePath) {
                // Update the state to trigger re-render
                setUserImage(response.data.imagePath);
                handleImageModalClose();
            }
        } catch (error) {
            console.error("Error uploading profile image:", error.response?.data || error.message);
        }
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
                                    <span className="mt-2">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="profile-image-container">
                                        <img 
                                            src={`http://localhost:5000${userImage}`}
                                            alt="Profile" 
                                            className="img-fluid rounded-circle mb-3" 
                                            width="150" 
                                            height="150"
                                        />
                                        <Button 
                                            variant="success" 
                                            className="edit-profile-btn"
                                            onClick={() => setShowImageModal(true)}
                                        >
                                            <i className="bi bi-pencil"></i> 
                                        </Button>
                                    </div>
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
                        {enrolledFormations.length > 0 ? (
                            enrolledFormations.map((formation) => (
                                <div key={formation.enrollment_id} className="col-md-4 mb-4">
                                    <div className="card formation-card">
                                        <div className="card-body text-center">
                                            <h5 className="card-title">{formation.formation_title}</h5>
                                            <p className="card-text">{formation.formation_description}</p>
                                            <p className="card-text">
                                                Rating: {formation.rating === 0 ? "Not assigned" : formation.rating}
                                            </p>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleLeaveFormation(formation.enrollment_id)}
                                            >
                                                Leave Formation
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">No enrolled formations yet.</p>
                        )}
                    </div>

                    <h3 className="display-6 text-center mt-5">Recommended Courses</h3>
                    <div className="row">
                        {recommendedCourses.length > 0 ? (
                            recommendedCourses.map((course) => (
                                <div key={course.id} className="col-md-4 mb-4">
                                    <div className="card formation-card">
                                        <div className="card-body text-center">
                                            <h5 className="card-title">{course.title}</h5>
                                            <p className="card-text">{course.description}</p>
                                            <Button
                                                variant="success"
                                                onClick={() => handleRegisterRecommendedCourse(course.id)}
                                            >
                                                Register
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">No recommendations available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit User Info Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUserName" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formUserEmail" className="mb-3">
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

            {/* Edit Profile Image Modal */}
            <Modal show={showImageModal} onHide={handleImageModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Profile Picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleImageSubmit}>
                        <Form.Group controlId="formProfileImage" className="mb-3">
                            <Form.Label>Select an image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                                required
                            />
                        </Form.Group>
                        {selectedFile && (
                            <div className="image-preview mb-3">
                                <p>Preview:</p>
                                <img 
                                    src={URL.createObjectURL(selectedFile)} 
                                    alt="Preview" 
                                    className="img-thumbnail"
                                    style={{ maxHeight: '200px' }}
                                />
                            </div>
                        )}
                        <Button variant="success" type="submit">
                            Upload Image
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
