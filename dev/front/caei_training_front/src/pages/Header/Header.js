import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from "lucide-react"; // Import Logout Icon
import logo from '../../assets/logo.png'; 
import './Header.css'; 

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); 
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-transparent">
      <div className="container-fluid">
        <Link className="nav-link active" to="/">
          <img src={logo} alt="Platform Logo" className="navbar-logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/formations">Formations</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/contact">Contact Us</Link>
            </li>
            {isAuthenticated && (
  <>
    <li className="nav-item">
      <Link 
        className="nav-link active" 
        to={`/${userRole}`} 
      >
        Profile
      </Link> 
    </li>
    <li className='nav-item'>
      {localStorage.getItem("role") !== 'agent' && (
        <Link 
          className="nav-link active" 
          to="/chatclientagent"
        >
          Contact Agent
        </Link>
      )}
    </li>
  </>
)}


          </ul>
          <div className="d-flex">
            {isAuthenticated ? (
              <button className="btn  d-flex align-items-center" onClick={handleLogout}>
                <LogOut size={25} className="me-2" /> 
              </button>
            ) : location.pathname !== "/login" && ( 
              <button className="btn btn-outline-success">
                <Link className="nav-link active" to="/login">Login</Link>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
