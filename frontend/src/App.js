import React from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
// import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          {/* <Route path='/register' element={<RegistrationPage/>}/> */}
          <Route path='/login' element={<LoginPage/>}/>
          <Route path="/home" element={<HomePage />} />
          <Route path='/' element={<Navigate to='/login' replace />} />  {/* Redirect to /register */}
        </Routes>
      </div>
    </Router>
  )
}

export default App;
