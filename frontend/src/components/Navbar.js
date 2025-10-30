import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container-fluid">
          <Link className="navbar-brand fw-semibold" to="/">
            <span className="me-1">🏢</span> JobBoard
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="nav">
          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item me-2">
              <Link className="nav-link" to="/jobs">Browse Jobs</Link>
            </li>
            {!user && (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-dark btn-sm" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-dark btn-sm" to="/register">Sign Up</Link>
                </li>
              </>
            )}
            {user && (
              <>
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item me-2">
                      <Link className="nav-link" to="/admin">Admin</Link>
                    </li>
                    <li className="nav-item me-2">
                      <Link className="nav-link" to="/admin/users">Manage Users</Link>
                    </li>
                    <li className="nav-item me-2">
                      <Link className="nav-link" to="/admin/applications">Applications</Link>
                    </li>
                    <li className="nav-item me-2">
                      <Link className="nav-link" to="/admin/messages">Messages</Link>
                    </li>
                  </>
                )}
                <li className="nav-item me-2">
                  <Link className="nav-link" to="/change-password">Change Password</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-dark btn-sm" onClick={onLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
