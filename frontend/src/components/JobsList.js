import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import auth from '../services/auth';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (query) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get('/jobs', { params: { q: query } });
      setJobs(res.data || []);
    } catch (err) {
      console.error('fetchJobs error', err);
      setError(err.message || 'Unable to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchJobs(q);
  };

  const user = auth.getUser();

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="jobs-page">
      {/* Header/Hero */}
      <div className="jobs-hero text-center py-5 mb-4">
        <h2 className="fw-bold mb-1">Find Your Next Job</h2>
        <div className="text-muted small mb-3">
          {loading ? 'Loading positions…' : `Browse through ${jobs.length} available positions`}
        </div>
        <form className="d-flex justify-content-center" onSubmit={handleSearch}>
          <div className="jobs-search d-flex w-100">
            <input
              className="form-control rounded-start-pill"
              placeholder="Search by job title, company, or location..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <button className="btn btn-dark rounded-end-pill px-4" type="submit">Search</button>
          </div>
        </form>
      </div>

      {loading && <div className="alert alert-info text-center">Loading jobs...</div>}
      {error && (
        <div className="alert alert-danger text-center">
          <strong>Error:</strong> {error}
          <div className="mt-2">
            <button className="btn btn-sm btn-dark me-2" onClick={() => fetchJobs(q)}>Retry</button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="row g-4">
          {jobs.map(job => (
            <div key={job._id} className="col-md-4">
              <div className="card h-100 shadow-sm job-card">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0"><Link to={`/jobs/${job._id}`}>{job.title}</Link></h5>
                    <span className="badge bg-dark text-white job-type-badge">{job.type || 'Full-time'}</span>
                  </div>
                  <div className="text-muted small mb-2">{job.company}</div>
                  <ul className="list-unstyled small text-muted mb-2">
                    <li>📍 {job.location || 'Remote'}</li>
                    <li>💲 {job.salary || '$ -'}</li>
                  </ul>
                  <p className="text-muted small flex-grow-1">{(job.description || '').slice(0, 140)}{(job.description || '').length > 140 ? '…' : ''}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Posted {new Date(job.createdAt).toLocaleDateString()}</small>
                    <div>
                      {user?.role === 'admin' && (
                        <>
                          <Link to={`/admin/jobs/${job._id}/edit`} className="btn btn-sm btn-outline-secondary me-2">Edit</Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteJob(job._id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
