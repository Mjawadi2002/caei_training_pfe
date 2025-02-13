import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'; 
import './Header.css'; 

export default function Header() {
  const location = useLocation();
  return (
    <nav className="navbar navbar-expand-lg navbar-transparent">
      <div className="container-fluid">
      <Link className="nav-link active" to="/"><img src={logo} alt="Platform Logo" className="navbar-logo" /></Link>
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
              <Link className="nav-link active" to="/contact">Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/formations">Formations</Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
          {location.pathname !== '/login' && (
            <form className="d-flex" role="search">
              <button className="btn btn-outline-success" type="submit"><Link className="nav-link active" to="/login">Login</Link></button>
            </form>
          )}
          </form>
        </div>
      </div>
    </nav>
  );
}
