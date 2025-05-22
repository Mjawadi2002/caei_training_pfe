import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { Table, Button, Container, Row, Col, Card, Spinner, Modal, Form } from "react-bootstrap";
import { FaTrash, FaUserPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]); 
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    course: "",
    studentId: "",
    courseId: "",
    dateEnrolled: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
  }, [fetchEnrollments, fetchStudents, fetchCourses]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/enrollment", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load enrollments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/users/role/apprenant", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students.");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/formations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses.");
    }
  };

  const deleteEnrollment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/enrollment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments((prevEnrollments) =>
        prevEnrollments.filter((enrollment) => enrollment.enrollment_id !== id)
      );
      toast.success("Enrollment deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete enrollment.");
      toast.error("Failed to delete enrollment.");
    }
  };

  const handleShow = () => {
    setFormData({ studentName: "", course: "", studentId: "", courseId: "", dateEnrolled: "" });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "studentName") {
      const student = students.find(student => student.name === value);
      if (student) {
        setFormData(prevFormData => ({ ...prevFormData, studentId: student.id }));
      }
    }

    if (name === "course") {
      const course = courses.find(course => course.title === value);
      if (course) {
        setFormData(prevFormData => ({ ...prevFormData, courseId: course.id }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.courseId) {
      toast.error("Please select a valid student and course.");
      return;
    }

    try {
      const enrollmentData = {
        apprenant_id: formData.studentId,
        formation_id: formData.courseId,
        date_enrolled: formData.dateEnrolled || new Date()
      };

      await axios.post("http://localhost:5000/api/v1/enrollment", enrollmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEnrollments();
      handleClose();
      toast.success("Enrollment added successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
      toast.error("Operation failed.");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4">Manage Enrollments</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <Table striped bordered hover responsive className="text-center">
            <thead className="bg-dark text-white">
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Date Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length > 0 ? (
                enrollments.map((enrollment, index) => (
                  <tr key={enrollment.id || index}>
                    <td>{enrollment.enrollment_id}</td>
                    <td>{enrollment.apprenant_name}</td>
                    <td>{enrollment.formation_title}</td>
                    <td>{enrollment.registration_date}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => deleteEnrollment(enrollment.enrollment_id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No enrollments found.</td></tr>
              )}
            </tbody>
          </Table>
        )}

        <Row className="mt-3">
          <Col className="text-center">
            <Button variant="success" size="lg" onClick={handleShow}>
              <FaUserPlus /> Add Enrollment
            </Button>
          </Col>
        </Row>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Enrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formStudentName">
              <Form.Label>Student Name</Form.Label>
              <Form.Control as="select" name="studentName" value={formData.studentName} onChange={handleChange} required>
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.name}>{student.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCourse">
              <Form.Label>Course</Form.Label>
              <Form.Control as="select" name="course" value={formData.course} onChange={handleChange} required>
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.title}>{course.title}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDateEnrolled">
              <Form.Label>Date Enrolled</Form.Label>
              <Form.Control
                type="date"
                name="dateEnrolled"
                value={formData.dateEnrolled}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              Add Enrollment
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </Container>
  );
}
