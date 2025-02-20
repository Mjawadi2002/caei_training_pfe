import { Outlet, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const ProtectedRoutes = ({ allowedRoles }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token && role) {
            setUser({ token, role });
        } else {
            setUser(false);
        }
    }, []);

    if (user === null) {
        return <div>Loading...</div>;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/accessdenied" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
