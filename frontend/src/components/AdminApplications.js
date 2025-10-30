import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [q, setQ] = useState('');

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/applications');
      setItems(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const filtered = items.filter(i => {
    const hay = `${i.name} ${i.email} ${i.job?.title} ${i.job?.company}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <h3 className="mb-3">Applications</h3>
      <div className="d-flex mb-3">
        <input className="form-control me-2" placeholder="Search by applicant, email, job or company" value={q} onChange={e => setQ(e.target.value)} />
        <button className="btn btn-outline-secondary" onClick={load}>Refresh</button>
      </div>
      {loading && <div className="alert alert-info">Loading…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>When</th>
                <th>Job</th>
                <th>Applicant</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Resume</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a._id}>
                  <td className="text-nowrap">{new Date(a.createdAt).toLocaleString()}</td>
                  <td>{a.job?.title} <span className="text-muted">({a.job?.company})</span></td>
                  <td>{a.name}</td>
                  <td><a href={`mailto:${a.email}`}>{a.email}</a></td>
                  <td>{a.phone || '-'}</td>
                  <td>{a.resumeUrl ? <a href={a.resumeUrl} target="_blank" rel="noreferrer">Open</a> : '-'}</td>
                  <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => remove(a._id)}>Delete</button></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="text-center text-muted">No applications yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
