import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Link } from 'react-router-dom'; 
import "./Login.css"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/users/login/", {
        email,
        password,
      });
  
      const { token, role } = res.data;
  
      // Store token and role in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
  
      // Redirect based on role
      switch (role) {
        case "apprenant":
          navigate("/apprenant");
          break;
        case "admin":
          navigate("/admin");
          break;
        case "agent":
          navigate("/agent");
          break;
        case "formateur":
          navigate("/formateur");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
    }
  };
  

  return (
    <div className="register-container">
      <form className="register-form-container" onSubmit={handleLogin}>
        <h2 className="form-title">Welcome Back</h2>
        <div className="mb-3">
          <input 
            type="email" 
            className="form-control" 
            placeholder="Please enter your email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control" 
            placeholder="Please enter your password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-success">Login</button>
          <Link to="/register" className="btn btn-dark">Register</Link>
        </div>
      </form>
    </div>
  );
}
