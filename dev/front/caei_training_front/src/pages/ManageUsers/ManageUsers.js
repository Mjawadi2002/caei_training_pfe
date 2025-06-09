import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Card, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageUsers() {
  // ... existing state ...

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('User deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user.");
      toast.error(err.response?.data?.error || "Failed to delete user.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const createUser = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);
      
      if (selectedFile) {
        formDataToSend.append('profileImage', selectedFile);
      }

      const response = await axios.post("http://localhost:5000/api/v1/users", formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      fetchUsers();
      handleClose();
      toast.success('User created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user.");
      toast.error(err.response?.data?.error || "Failed to create user.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const updateUser = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('role', formData.role);
      
      if (selectedFile) {
        formDataToSend.append('profileImage', selectedFile);
      }

      const response = await axios.put(`http://localhost:5000/api/v1/users/${currentUser.id}`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      fetchUsers();
      handleClose();
      toast.success('User updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user.");
      toast.error(err.response?.data?.error || "Failed to update user.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "95%" }}>
      <ToastContainer />
      <Card className="shadow-lg p-4">
        {/* ... rest of the JSX ... */}
      </Card>
    </Container>
  );
} 