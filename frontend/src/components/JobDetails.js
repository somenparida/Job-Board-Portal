import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', resumeUrl: '', coverLetter: '' });
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    };
    load();
  }, [id]);

  if (!job) return <div className="container py-4">Loading...</div>;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);
    if (!form.name || !form.email) {
      setNotice({ type: 'danger', text: 'Name and email are required.' });
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/jobs/${id}/apply`, form);
      setNotice({ type: 'success', text: 'Application submitted! We\'ll be in touch.' });
      setForm({ name: '', email: '', phone: '', resumeUrl: '', coverLetter: '' });
    } catch (err) {
      const apiMsg = err?.original?.response?.data?.message;
      const errs = err?.original?.response?.data?.errors;
      const text = apiMsg || (Array.isArray(errs) && errs.length ? errs[0].msg : err.message) || 'Submission failed';
      setNotice({ type: 'danger', text });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <Link to="/jobs" className="text-decoration-none small">← Back to Jobs</Link>
      <h3 className="mt-2">{job.title}</h3>
      <div className="text-muted mb-2">{job.company}</div>

      <div className="card p-3 mb-3">
        <div className="d-flex flex-wrap gap-2 small">
          <span>📍 {job.location || 'Remote'}</span>
          <span className="badge bg-light text-dark border">{job.type || 'Full-time'}</span>
          <span>💲 {job.salary || '$ -'}</span>
          <span>📅 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="card p-3 mb-3">
        <h6 className="fw-semibold">Job Description</h6>
        <div>{job.description || 'No description provided.'}</div>
      </div>

      <div className="card p-3 mb-4">
        <h6 className="fw-semibold">Apply for {job.title}</h6>
        <p className="text-muted small">Fill out the form below to submit your application</p>
        {notice && (
          <div className={`alert alert-${notice.type}`}>{notice.text}</div>
        )}
        <form className="row g-3" onSubmit={onSubmit}>
          <div className="col-md-6">
            <label className="form-label">Full Name *</label>
            <input name="name" className="form-control" placeholder="Your Name" value={form.name} onChange={onChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email *</label>
            <input name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={onChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <input name="phone" className="form-control" value={form.phone} onChange={onChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Resume URL</label>
            <input name="resumeUrl" className="form-control" placeholder="https://" value={form.resumeUrl} onChange={onChange} />
          </div>
          <div className="col-12">
            <label className="form-label">Cover Letter</label>
            <textarea name="coverLetter" rows="4" className="form-control" placeholder="Tell us why you're a great fit for this role..." value={form.coverLetter} onChange={onChange} />
          </div>
          <div className="col-12 d-flex">
            <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setForm({
              name: 'Jane Developer',
              email: 'jane.dev@example.com',
              phone: '555-012-3456',
              resumeUrl: 'https://example.com/resume/jane-developer.pdf',
              coverLetter: "Hi team, I'm a React-focused Frontend Engineer with 4+ years experience building responsive UIs, component libraries, and design systems. I'm excited about this role and how I can contribute."
            })}>Use sample data</button>
            <button type="submit" className="btn btn-dark me-2" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Application'}</button>
            <Link to="/jobs" className="btn btn-outline-secondary">Cancel</Link>
          </div>
        </form>
      </div>

      <div className="text-muted small">Posted by: {job.postedBy?.name} ({job.postedBy?.email})</div>
    </div>
  );
}
