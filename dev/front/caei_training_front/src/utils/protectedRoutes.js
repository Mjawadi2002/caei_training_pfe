import { Outlet, Navigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const ProtectedRoutes = () => {
    const [user, setUser] = useState(null); 
    const location = useLocation();

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

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    const roleRoutes = {
        admin: "/admin",
        apprenant: "/apprenant",
        agent: "/agent",
        formateur: "/formateur",
    };

    if (roleRoutes[user.role] !== location.pathname) {
        return <Navigate to={roleRoutes[user.role]} replace />;
    }

    return <Outlet />; 
};

export default ProtectedRoutes;
