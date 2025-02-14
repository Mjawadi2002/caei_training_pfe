import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react"; 
import { Link } from 'react-router-dom';
import './Register.css'; 

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/users/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);  
      navigate("/user"); 
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <form className="register-form" onSubmit={handleRegister}>
          <h2 className="form-title">Create Account</h2>

          <div className="form-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter your name" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter your email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter your password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-success">Create Account</button> 
          </div>

          <p className="redirect-link">
            Already have an account? 
            <Link to="/login" className="link-to-login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
