import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, jobs: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const usersRes = await api.get('/users');
        const jobsRes = await api.get('/jobs');
        setStats({ users: usersRes.data.length, jobs: jobsRes.data.length });
      } catch (err) {
        // ignore for now
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <h3>Admin Dashboard</h3>
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Total Users</h5>
            <p className="display-6">{stats.users}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Total Jobs</h5>
            <p className="display-6">{stats.jobs}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Quick Actions</h5>
            <Link to="/admin/jobs/new" className="btn btn-primary me-2">Post Job</Link>
            <Link to="/admin/users" className="btn btn-secondary me-2">Manage Users</Link>
            <Link to="/admin/applications" className="btn btn-outline-dark me-2">View Applications</Link>
            <Link to="/admin/messages" className="btn btn-outline-secondary">View Messages</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
