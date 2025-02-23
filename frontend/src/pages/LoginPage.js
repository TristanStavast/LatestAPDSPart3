import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';


function LoginPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ accountNumber: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        axios.get('/api/csrf-token', { withCredentials: true }).then(response => {
            console.log('CSRF Token receives: ', response.data.csrfToken)
            setCsrfToken(response.data.csrfToken)
        })
        .catch(err => {
            console.error('Failed to get csrf: ', err)
        })
    }, [])

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        console.log('Sending csrf token: ', csrfToken)

        try {
            const response = await axios.post('/api/login', credentials, {
                headers: { 'X-CSRF-TOKEN': csrfToken },
                withCredentials: true
            });

            console.log("Login Successful")

            localStorage.setItem('token', response.data.token);
            navigate('/home');  // Redirect to Home Page after login
        } catch (error) {
            console.error("Login failed!", error);
            setError("Login failed! Please check your credentials and try again at a later date.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>International Payments Portal</h1>
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

            </form>
        </div>
    );
}

export default LoginPage;