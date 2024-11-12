import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { Link } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ accountNumber: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/login', credentials);
            localStorage.setItem('token', response.data.token);
            navigate('/home');  // Redirect to Home Page after login
        } catch (error) {
            console.error("Login failed!", error);
            setError("Login failed! Please check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>
                
                {error && <p className="error-message">{error}</p>}
                
                <input
                    name="accountNumber"
                    type="text"
                    placeholder="Account Number"
                    value={credentials.accountNumber}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {/* <p className='redirect-link'>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p> */}
            </form>
        </div>
    );
}

export default LoginPage;
