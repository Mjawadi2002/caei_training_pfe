import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from "lucide-react"; // Import Logout Icon
import { Home as HomeIcon, Info, BookOpen, Mail, User, MessageSquare } from 'lucide-react'; // Import example icons
import './Sidebar.css';

function Sidebar({ isSidebarOpen }) {
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
    <div className={`sidebar ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <Link className="sidebar-nav-link" to="/">
              <HomeIcon size={20} className="me-2" /> Home
            </Link>
          </li>
          <li className="sidebar-nav-item">
            <Link className="sidebar-nav-link" to="/about">
              <Info size={20} className="me-2" /> About Us
            </Link>
          </li>
          <li className="sidebar-nav-item">
            <Link className="sidebar-nav-link" to="/formations">
              <BookOpen size={20} className="me-2" /> Formations
            </Link>
          </li>
          <li className="sidebar-nav-item">
            <Link className="sidebar-nav-link" to="/contact">
              <Mail size={20} className="me-2" /> Contact Us
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li className="sidebar-nav-item">
                <Link
                  className="sidebar-nav-link"
                  to={`/${userRole}`}
                >
                  <User size={20} className="me-2" /> Profile
                </Link>
              </li>
              <li className='sidebar-nav-item'>
                {localStorage.getItem("role") == 'apprenant' && (
                  <Link
                    className="sidebar-nav-link"
                    to="/chatclientagent"
                  >
                    <MessageSquare size={20} className="me-2" /> Contact Agent
                  </Link>
                )}
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="sidebar-footer">
        {isAuthenticated ? (
          <button className="sidebar-btn-logout" onClick={handleLogout}>
            <LogOut size={20} className="me-2" />
            Logout
          </button>
        ) : location.pathname !== "/login" && (
          <button className="sidebar-btn-login">
            <Link className="sidebar-nav-link" to="/login">Login</Link>
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar; 