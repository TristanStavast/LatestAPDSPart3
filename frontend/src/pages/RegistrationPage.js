import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import { Link } from 'react-router-dom'

function RegistrationPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        idNumber: '',
        accountNumber: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Basic validation
        if (!formData.fullName || !formData.idNumber || !formData.accountNumber || !formData.password) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/register', formData);
            setSuccess(true);
            alert("Registration successful!");
        } catch (error) {
            console.error("Error registering:", error);
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Register</h2>
                
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Registration successful! Please log in.</p>}

                <input
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                <input
                    name="idNumber"
                    type="text"
                    placeholder="ID Number"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                />
                <input
                    name="accountNumber"
                    type="text"
                    placeholder="Account Number"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p className='redirect-link'>
                    Already have an account? <Link to="/login">Log in here</Link>
                </p>
            </form>
        </div>
    );
}

export default RegistrationPage;
