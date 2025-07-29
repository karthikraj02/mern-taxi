// /frontend/src/pages/Login.js

//import mountains from '/image.jpg';
//import image from '../assets/image.jpg';
import image from '../assets/image.jpg';

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);

      if (res.data.user.role === 'rider') {
        navigate('/rider');
      } else if (res.data.user.role === 'driver') {
        navigate('/driver');
      }
    } catch {
      setError('Invalid credentials');
    }
  };

return (
  <div
    className="login-background"
    style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
    <div className="login-glass">
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Please enter your credentials to continue</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '0.5em' }}>{error}</p>}
        <p style={{ color: '#fff' }}>
          Don't have an account? <Link to="/register" style={{ color: '#ffd9c2', textDecoration: 'underline' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
