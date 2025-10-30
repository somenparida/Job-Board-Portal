import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminContactMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [q, setQ] = useState('');

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/contact-messages');
      setItems(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact-messages/${id}`);
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const filtered = items.filter(i => {
    const hay = `${i.name} ${i.email} ${i.message}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <h3 className="mb-3">Contact Messages</h3>
      <div className="d-flex mb-3">
        <input className="form-control me-2" placeholder="Search by name, email, or message" value={q} onChange={e => setQ(e.target.value)} />
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
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m._id}>
                  <td className="text-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                  <td>{m.name}</td>
                  <td><a href={`mailto:${m.email}`}>{m.email}</a></td>
                  <td style={{maxWidth: 480}}><div className="text-truncate" title={m.message}>{m.message}</div></td>
                  <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => remove(m._id)}>Delete</button></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="text-center text-muted">No messages yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
