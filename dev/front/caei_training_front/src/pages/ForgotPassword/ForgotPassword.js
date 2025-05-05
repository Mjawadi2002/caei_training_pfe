import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/v1/users/forgot-password', { email });
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send reset code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/v1/users/verify-reset-code', {
                email,
                code
            });
            setStep(3);
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid reset code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/v1/users/reset-password', {
                email,
                code,
                newPassword
            });
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h2 className="form-title">
                    {step === 1 && 'Reset Password'}
                    {step === 2 && 'Enter Reset Code'}
                    {step === 3 && 'Create New Password'}
                </h2>

                {error && <div className="alert alert-danger">{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleRequestCode}>
                        <div className="mb-3 input-group">
                            <span className="input-group-text bg-light"><FaEnvelope /></span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                            {isLoading ? <BiLoaderCircle className="spinner-border" /> : 'Send Reset Code'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode}>
                        <div className="mb-3 input-group">
                            <span className="input-group-text bg-light"><FaKey /></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter reset code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                            {isLoading ? <BiLoaderCircle className="spinner-border" /> : 'Verify Code'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3 input-group">
                            <span className="input-group-text bg-light"><FaLock /></span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3 input-group">
                            <span className="input-group-text bg-light"><FaLock /></span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                            {isLoading ? <BiLoaderCircle className="spinner-border" /> : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
} 