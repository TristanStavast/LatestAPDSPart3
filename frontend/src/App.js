import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import axios from 'axios';

function App() {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    async function getCsrfToken() {
        try {
            const response = await axios.get('/api/csrf-token', { withCredentials: true });
            setCsrfToken(response.data.csrfToken); // ✅ Ensure csrfToken is set
        } catch (error) {
            console.error("Failed to fetch CSRF token:", error);
        }
    }
    getCsrfToken();
}, []);

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<LoginPage csrfToken={csrfToken} />}/>
          <Route path="/home" element={<HomePage />} />
          <Route path='/' element={<Navigate to='/login' replace />} />  {/* Redirect to /register */}
        </Routes>
      </div>
    </Router>
  )
}

export default App;
