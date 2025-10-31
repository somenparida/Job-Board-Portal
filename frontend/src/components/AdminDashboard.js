import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

// Small helpers
const fmt = (n) => new Intl.NumberFormat().format(n || 0);
const isToday = (d) => {
  const t = new Date();
  const x = new Date(d);
  return (
    x.getFullYear() === t.getFullYear() &&
    x.getMonth() === t.getMonth() &&
    x.getDate() === t.getDate()
  );
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [u, j, a] = await Promise.all([
          api.get('/users'),
          api.get('/jobs'),
          api.get('/applications'),
        ]);
        setUsers(u.data || []);
        setJobs(j.data || []);
        setApps(a.data || []);
      } catch (err) {
        // noop — show what we can
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalUsers = users.length;
  const totalJobs = jobs.length;
  const totalApps = apps.length;
  const newToday = useMemo(() => apps.filter(a => isToday(a.createdAt)).length, [apps]);
  const avgAppsPerJob = useMemo(() => (totalJobs ? Math.round(totalApps / totalJobs) : 0), [totalApps, totalJobs]);

  // Build a recent activity feed from jobs, applications, and users
  const recentActivity = useMemo(() => {
    const j = jobs.map(j => ({
      _id: j._id,
      when: new Date(j.createdAt || j.updatedAt || Date.now()),
      label: `Job posted: ${j.title}`,
      tag: 'job',
    }));
    const a = apps.map(a => ({
      _id: a._id,
      when: new Date(a.createdAt || Date.now()),
      label: `New application for ${a.job?.title || 'job'}`,
      tag: 'application',
    }));
    const u = users.map(u => ({
      _id: u._id,
      when: new Date(u.createdAt || Date.now()),
      label: `New user registered: ${u.name}`,
      tag: 'user',
    }));
    return [...j, ...a, ...u]
      .sort((x, y) => y.when - x.when)
      .slice(0, 6);
  }, [jobs, apps, users]);

  const StatCard = ({ title, value, icon, variant }) => (
    <div className="col-lg-3 col-sm-6">
      <div className={`card admin-card stat-card ${variant} mb-3`}>
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="muted small">{title}</div>
            <div className="muted">{icon}</div>
          </div>
          <div className="h3 mb-1" style={{ fontWeight: 800 }}>{fmt(value)}</div>
          <div className="text-success small">+2% from last month</div>
        </div>
      </div>
    </div>
  );

  const QuickStats = () => (
    <div className="card admin-card">
      <div className="card-body">
        <div className="fw-semibold mb-3">Quick Stats</div>
        <div className="row g-2 small">
          <div className="col-8 muted">Active Jobs</div><div className="col-4 text-end fw-bold">{fmt(totalJobs)}</div>
          <div className="col-8 muted">Pending Jobs</div><div className="col-4 text-end fw-bold">0</div>
          <div className="col-8 muted">Closed Jobs</div><div className="col-4 text-end fw-bold">0</div>
          <div className="col-8 muted">Avg. Applicants/Job</div><div className="col-4 text-end fw-bold">{fmt(avgAppsPerJob)}</div>
        </div>
      </div>
    </div>
  );

  const Activity = () => (
    <div className="card admin-card">
      <div className="card-body">
        <div className="fw-semibold mb-3">Recent Activity</div>
        <div className="list-group list-group-flush list-clean">
          {recentActivity.map(item => (
            <div key={item._id} className="list-group-item d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold small mb-1">{item.label}</div>
                <div className="muted small">{item.when.toLocaleString()}</div>
              </div>
              <span className="chip"><span>●</span>{item.tag}</span>
            </div>
          ))}
          {recentActivity.length === 0 && <div className="muted small">No recent activity</div>}
        </div>
      </div>
    </div>
  );
  return (
    <AdminLayout>
        <div className="mb-3 dash-header">
          <h3 className="mb-0">Dashboard</h3>
          <div className="subtitle small">Welcome back! Here's an overview of your job board.</div>
        </div>

        {/* Top stat cards */}
        <div className="row mb-4">
          <StatCard title="Total Jobs" value={totalJobs} icon="📦" variant="stat-jobs" />
          <StatCard title="Active Applications" value={totalApps} icon="🗂️" variant="stat-apps" />
          <StatCard title="Registered Users" value={totalUsers} icon="👤" variant="stat-users" />
          <StatCard title="New Today" value={newToday} icon="📈" variant="stat-new" />
        </div>

        <div className="row">
          <div className="col-lg-8 mb-3">
            <Activity />
          </div>
          <div className="col-lg-4 mb-3">
            <QuickStats />
          </div>
        </div>
    </AdminLayout>
  );
}
