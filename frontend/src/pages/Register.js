import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import image from '../assets/image.jpg';
import './Register.css';                                   // Make sure Register.css has your provided styles

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('rider');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch {
      setError('Registration failed, email might already exist.');
    }
  };

  return (
    <div className="register-background"
        style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="register-glass">
        <h2 className="register-title">Register</h2>
        <p className="register-subtitle">Create a new account to get started</p>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            className="register-input"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="register-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="register-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="register-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="rider">Rider</option>
            <option value="driver">Driver</option>
          </select>
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}
        <p style={{ color: '#fff' }}>
          Already have an account?{' '}
          <Link to="/login" className="back-login-link" style={{ color: '#ffd9c2', textDecoration: 'underline' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
