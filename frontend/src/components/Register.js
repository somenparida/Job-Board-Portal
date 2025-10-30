import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import auth from '../services/auth';

export default function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      // enforce public registrations as normal users
      const user = await auth.register(name, email, password, 'user');
      onRegister && onRegister(user);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="py-5">
        <div className="container d-flex justify-content-center">
          <div className="card p-4 shadow-sm" style={{ maxWidth: 520, width: '100%' }}>
            <h3 className="mb-2">Create Account</h3>
            <p className="text-muted small mb-3">Enter your details to create a new account</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input className="form-control" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-1">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="text-muted small mb-3">Must be at least 8 characters</div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>
              <button className="btn btn-dark w-100" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
            </form>
            <div className="text-center mt-3 small">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
