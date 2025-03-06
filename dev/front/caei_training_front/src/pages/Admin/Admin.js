import { Link } from "react-router-dom";
import axios from "axios";
import './Admin.css'; 
import { useEffect, useState } from "react";

export default function Admin() {
    const [countUsers, setCountUsers] = useState(0);
    const [countFormations, setCountFormations] = useState(0);
    const [countFormateur, setCountFormateur] = useState(0);
    const [countReclamations,setCountReclamations]=useState(0);
    const [countEnrollment,setCountEnrollment]=useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const usersResponse = await axios.get('http://localhost:5000/api/v1/users/countClients');
                const formateursResponse = await axios.get('http://localhost:5000/api/v1/users/countFormateurs');
                const formationsResponse = await axios.get('http://localhost:5000/api/v1/users/countFormations');
                const reclamationsResponse=await axios.get('http://localhost:5000/api/v1/email/getCountOfReclamations');
                const enrollmentResponse=await axios.get('http://localhost:5000/api/v1/enrollment/count');
                setCountUsers(usersResponse.data.count);
                setCountFormateur(formateursResponse.data.count);
                setCountFormations(formationsResponse.data.count);
                setCountReclamations(reclamationsResponse.data.count);
                setCountEnrollment(enrollmentResponse.data.enrollment_count);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="container mt-5 fade-in">
            <h1 className="display-4 text-dark text-center">Admin Dashboard</h1>
            <div className="row mt-4 py-4">
                <div className="col-md-4 mb-4">
                    <div className="card dashboard-card">
                        <div className="card-body text-center">
                            <h2 className="card-title">{countUsers}</h2>
                            <p className="card-text">Clients</p>
                            <Link to="/admin/manage-clients" className="btn btn-success">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card dashboard-card">
                        <div className="card-body text-center">
                            <h2 className="card-title">{countFormations}</h2>
                            <p className="card-text">Formations</p>
                            <Link to="/admin/manage-formations" className="btn btn-success">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card dashboard-card">
                        <div className="card-body text-center">
                            <h2 className="card-title">{countFormateur}</h2>
                            <p className="card-text">Formateurs</p>
                            <Link to="/admin/manage-formateurs" className="btn btn-success">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card dashboard-card">
                        <div className="card-body text-center">
                            <h2 className="card-title">{countEnrollment}</h2>
                            <p className="card-text">Enrollments</p>
                            <Link to="/admin/manage-enrollment" className="btn btn-success">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card dashboard-card">
                        <div className="card-body text-center">
                            <h2 className="card-title">{countReclamations}</h2>
                            <p className="card-text">Réclamations</p>
                            <Link to="/admin/manage-reclamations" className="btn btn-success">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
