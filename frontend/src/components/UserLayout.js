import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../user.css';

function ULink({ to, label }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={active ? 'active' : ''}>{label}</Link>
  );
}

export default function UserLayout({ children }) {
  return (
    <div className="row user-layout">
      <aside className="col-md-3 col-lg-2 user-sidebar">
        <div className="py-3">
          <div className="user-brand mb-3">Job Portal</div>
          <nav className="user-nav d-flex flex-column">
            <ULink to="/dashboard" label="Dashboard" />
            <ULink to="/jobs" label="Browse Jobs" />
            <ULink to="/dashboard" label="My Applications" />
            <ULink to="/dashboard" label="Saved Jobs" />
            <ULink to="/dashboard" label="Profile" />
            <ULink to="/change-password" label="Settings" />
          </nav>
        </div>
      </aside>
      <section className="col-md-9 col-lg-10 user-content">
        {children}
      </section>
    </div>
  );
}
