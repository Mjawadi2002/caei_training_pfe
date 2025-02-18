import { Outlet, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const ProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); 
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; 
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
