import React from "react";
import { Link } from 'react-router-dom'; 
import "./Login.css"; 

export default function Login() {
  return (
    <div className="register-container">
      <form className="register-form-container">
        <h2 className="form-title">Welcome Back</h2>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Please enter your email" id="email" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Please enter your password" id="password" />
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-success">Login</button>
          <button type="button" className="btn btn-warning"><Link className="nav-link active" to="/register">Register</Link></button>
        </div>

      </form>
    </div>
  );
}
