import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react"; 
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi"; 
import './Register.css'; 

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/v1/users/register", {
        name,
        email,
        password,
      }); 
      navigate("/login"); 
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <form className="register-form" onSubmit={handleRegister}>
          <h2 className="form-title">Create Account</h2>

          <div className="form-group input-group">
            <span className="input-group-text bg-light"><FaUser size={18} /></span>
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

          <div className="form-group input-group">
            <span className="input-group-text bg-light"><FaEnvelope size={18} /></span>
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

          <div className="form-group input-group">
            <span className="input-group-text bg-light"><FaLock size={18} /></span>
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
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? <BiLoaderCircle className="spinner-border" /> : "Create Account"}
            </button> 
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
