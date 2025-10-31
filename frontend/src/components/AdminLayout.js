import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import auth from '../services/auth';
import '../admin.css';

function NavItem({ to, icon, label }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`admin-nav-link list-group-item-action ${active ? 'active' : ''}`}
      style={{ textDecoration: 'none' }}
    >
      <span className="admin-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const logout = () => { auth.logout(); navigate('/login'); };

  return (
    <div className="row admin-layout">
      <aside className="col-md-3 col-lg-2 mb-4">
        <div className="sticky-top admin-sidebar" style={{ top: 16 }}>
          <div className="fs-6 fw-semibold mb-3 admin-brand">Job Board Admin</div>
          <div className="list-group admin-nav">
            <NavItem to="/admin" icon="🏠" label="Dashboard" />
            <NavItem to="/admin/jobs" icon="🧰" label="Jobs Management" />
            <NavItem to="/admin/applications" icon="📨" label="Applications" />
            <NavItem to="/admin/users" icon="👥" label="Users" />
            <NavItem to="/admin/messages" icon="📊" label="Analytics" />
            <NavItem to="/change-password" icon="⚙️" label="Settings" />
          </div>
          <button onClick={logout} className="btn btn-light btn-sm mt-3 w-100">Logout</button>
        </div>
      </aside>
      <section className="col-md-9 col-lg-10 admin-content">
        {children}
      </section>
    </div>
  );
}
