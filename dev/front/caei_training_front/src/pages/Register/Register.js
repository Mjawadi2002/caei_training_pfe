import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import { FaEnvelope, FaLock, FaUser, FaCamera } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";
import './Register.css';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const res = await axios.post(
        "http://localhost:5000/api/v1/users/register",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate("/login");
      } else {
        navigate("/login");
      }
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

          <div className="profile-image-upload" onClick={triggerFileInput}>
            {previewImage ? (
              <img src={previewImage} alt="Profile preview" className="profile-preview" />
            ) : (
              <div className="profile-placeholder">
                <FaCamera size={24} />
                <span>Add Profile Photo</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group input-group">
            <span className="input-group-text bg-light"><FaUser size={18} /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? (
                <>
                  <BiLoaderCircle className="spinner" />
                  <span>Creating Account...</span>
                </>
              ) : "Create Account"}
            </button>
          </div>

          <p className="redirect-link">
            Already have an account?{" "}
            <Link to="/login" className="link-to-login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
