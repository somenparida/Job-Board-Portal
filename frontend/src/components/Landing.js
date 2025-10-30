import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Landing({ user }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [user]);

  if (user) return null;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/jobs');
        setJobs((res.data || []).slice(0, 6));
      } catch (err) {
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <section className="hero-section py-5 bg-light border-bottom">
        <div className="container text-center py-5">
          <h1 className="display-5 fw-bold mb-2">Find Your Dream Job Today</h1>
          <p className="text-muted mb-4">Connect with top employers and discover opportunities that match your skills and aspirations.</p>
          <div>
            <Link to="/jobs" className="btn btn-dark btn-sm me-2">Browse Jobs</Link>
            <Link to="/register" className="btn btn-outline-dark btn-sm">Sign Up Free</Link>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h5 className="text-center fw-semibold mb-4">Why Choose JobBoard?</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card p-3 feature-card">
                <div className="mb-2">📦</div>
                <div className="fw-semibold">Quality Jobs</div>
                <div className="text-muted small">Access thousands of verified job listings from top companies across various industries.</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 feature-card">
                <div className="mb-2">🔎</div>
                <div className="fw-semibold">Easy Search</div>
                <div className="text-muted small">Find the perfect job with our powerful search and filtering tools tailored to your needs.</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 feature-card">
                <div className="mb-2">📈</div>
                <div className="fw-semibold">Career Growth</div>
                <div className="text-muted small">Take the next step in your career with opportunities from startups to Fortune 500 companies.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold mb-0">Recent Jobs</h5>
            <Link to="/jobs" className="small">View all jobs →</Link>
          </div>
          {loading && <div className="alert alert-info">Loading jobs…</div>}
          {error && <div className="alert alert-warning">{error}</div>}
          {!loading && !error && (
            <div className="row g-4">
              {jobs.map(job => (
                <div key={job._id} className="col-md-4">
                  <div className="card h-100 shadow-sm job-card">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0"><Link to={`/jobs/${job._id}`}>{job.title}</Link></h6>
                        <span className="badge bg-light text-dark border">{job.type || 'Full-time'}</span>
                      </div>
                      <div className="text-muted small mb-2">{job.company}</div>
                      <ul className="list-unstyled small text-muted mb-2">
                        <li>📍 {job.location || 'Remote'}</li>
                        <li>💲 {job.salary || '$ -'}</li>
                      </ul>
                      <p className="text-muted small flex-grow-1">{(job.description || '').slice(0, 100)}{(job.description || '').length > 100 ? '…' : ''}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{new Date(job.createdAt).toLocaleDateString()}</small>
                        <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-outline-dark">Details</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-light border text-center">No jobs yet. Check back soon.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-light py-5 border-top border-bottom">
        <div className="container text-center">
          <h6 className="fw-semibold mb-2">Ready to Get Started?</h6>
          <p className="text-muted small mb-3">Join thousands of job seekers who have found their perfect position through JobBoard.</p>
          <Link to="/register" className="btn btn-dark btn-sm">Create Your Free Account</Link>
        </div>
      </section>

      
    </>
  );
}
