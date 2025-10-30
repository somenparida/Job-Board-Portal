import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import auth from '../services/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // preload remembered email
  useEffect(() => {
    const saved = localStorage.getItem('rememberEmail');
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await auth.login(email, password);
      if (remember) localStorage.setItem('rememberEmail', email); else localStorage.removeItem('rememberEmail');
      onLogin && onLogin(user);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="py-5">
        <div className="container d-flex justify-content-center">
          <div className="card p-4 shadow-sm" style={{ maxWidth: 520, width: '100%' }}>
            <h3 className="mb-2">Login</h3>
            <p className="text-muted small mb-3">Enter your email and password to access your account</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <label className="form-check-label" htmlFor="remember">Remember me</label>
              </div>
              <button className="btn btn-dark w-100" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
            </form>
            <div className="text-center mt-3 small">
              Don&apos;t have an account? <Link to="/register">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
