import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function User() {
    const [userId, setUserId ]= useState(null)
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decodedToken = jwtDecode(token); 
            const userId = decodedToken.id;

            console.log("Decoded Token: ", decodedToken);

            axios
                .get(`http://localhost:5000/api/v1/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log("User Data: ", response.data);

                    if (response.data) {
                        setUserId(response.data.id); 
                        setUserName(response.data.name); 
                        setUserEmail(response.data.email);
                        setUserRole(response.data.role);
                    } else {
                        console.error("User data not found in the response");
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

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg rounded-lg p-4">
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
                                    <p className="lead text-muted">
                                    <strong>Id:</strong> {userId || "N/A"}
                                </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
