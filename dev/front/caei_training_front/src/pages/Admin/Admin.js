import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUsers, FaBook, FaTools, FaCalendarCheck, FaChartBar } from "react-icons/fa";
import "./Admin.css";
import AdminStatistics from './AdminStatistics';

export default function AdminPanel() {
    const [countUsers, setCountUsers] = useState(0);
    const [countFormations, setCountFormations] = useState(0);
    const [countReclamations, setCountReclamations] = useState(0);
    const [countEnrollment, setCountEnrollment] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const usersResponse = await axios.get("http://localhost:5000/api/v1/users/countClients");
                const formationsResponse = await axios.get("http://localhost:5000/api/v1/users/countFormations");
                const reclamationsResponse = await axios.get("http://localhost:5000/api/v1/email/getCountOfReclamations");
                const enrollmentResponse = await axios.get("http://localhost:5000/api/v1/enrollment/count");
                setCountUsers(usersResponse.data.count);
                setCountFormations(formationsResponse.data.count);
                setCountReclamations(reclamationsResponse.data.count);
                setCountEnrollment(enrollmentResponse.data.enrollment_count);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        fetchCounts();
    }, []);

    const sections = [
        { name: "Clients", icon: <FaUsers className="text-primary" />, route: "/admin/manage-clients", count: countUsers, color: "text-primary" },
        { name: "Courses", icon: <FaBook className="text-success" />, route: "/admin/manage-formations", count: countFormations, color: "text-success" },
        { name: "Réclamations", icon: <FaTools className="text-warning" />, route: "/admin/manage-reclamations", count: countReclamations, color: "text-warning" },
        { name: "Enrollments", icon: <FaCalendarCheck className="text-danger" />, route: "/admin/manage-enrollment", count: countEnrollment, color: "text-danger" },
        { name: "Statistics", icon: <FaChartBar className="text-info" />, route: "/admin/statistics", count: "📊", color: "text-info" },
    ];

    return (
        <div className="container mt-5">
            <div className="row g-4">
                {sections.map((section) => (
                    <div key={section.name} className="col-md-6 col-lg-4">
                        <div className="card shadow-lg border-0 p-3 text-center" role="button">
                            <div className="card-body">
                                <div className={`display-4 ${section.color} mb-3`}>{section.icon}</div>
                                <h2 className="card-title fw-bold">{section.count}</h2>
                                <p className="card-text">{section.name}</p>
                                <Link to={section.route} className="btn btn-success">Manage</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}