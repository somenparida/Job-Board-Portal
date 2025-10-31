import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import '../admin.css';

// Derive a pseudo status to match the mock until backend supports it
const statusOf = (job) => {
  const id = String(job._id || job.title || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const mod = id % 10;
  if (mod === 0) return 'closed';
  if (mod <= 2) return 'pending';
  return 'active';
};

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [j, a] = await Promise.all([
          api.get('/jobs'),
          api.get('/applications'), // requires admin token; interceptor attaches it
        ]);
        setJobs(j.data || []);
        setApps(a.data || []);
      } catch (err) {
        try {
          // If applications require auth and failed, still render jobs
          const j = await api.get('/jobs');
          setJobs(j.data || []);
        } catch (e) {}
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // applicants count per job
  const applicantsByJob = useMemo(() => {
    const map = new Map();
    for (const a of apps) {
      const id = (a.job && (a.job._id || a.job)) || a.jobId;
      if (!id) continue;
      map.set(id, (map.get(id) || 0) + 1);
    }
    return map;
  }, [apps]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const s = statusOf(job);
      const matchesQ = q
        ? [job.title, job.company, job.location, job.type].some((v) => String(v || '').toLowerCase().includes(q.toLowerCase()))
        : true;
      const matchesStatus = status === 'all' ? true : s === status;
      return matchesQ && matchesStatus;
    });
  }, [jobs, q, status]);

  const onDelete = async (job) => {
    if (!window.confirm(`Delete job: ${job.title}?`)) return;
    try {
      await api.delete(`/jobs/${job._id}`);
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-3">
        <h3 className="mb-1">Jobs Management</h3>
        <div className="muted">Manage all job postings on your platform</div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3 jobs-toolbar">
        <div className="d-flex align-items-center gap-2" style={{ maxWidth: 680, width: '100%' }}>
          <div className="input-group">
            <span className="input-group-text bg-white">🔎</span>
            <input
              className="form-control"
              placeholder="Search jobs..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">active</option>
            <option value="pending">pending</option>
            <option value="closed">closed</option>
          </select>
        </div>
        <Link to="/admin/jobs/new" className="btn btn-dark">
          <span className="me-2">＋</span> Add New Job
        </Link>
      </div>

      <div className="card admin-card jobs-table">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Applicants</th>
                <th>Posted Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => {
                const s = statusOf(job);
                const count = applicantsByJob.get(job._id) || 0;
                return (
                  <tr key={job._id}>
                    <td><Link to={`/jobs/${job._id}`} className="text-decoration-none">{job.title}</Link></td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.type}</td>
                    <td>{job.salary}</td>
                    <td>
                      <span className={`status-badge status-${s}`}>{s}</span>
                    </td>
                    <td>{count}</td>
                    <td>{formatDate(job.createdAt)}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary btn-icon" onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}>…</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center muted py-4">{loading ? 'Loading jobs…' : 'No jobs found'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
