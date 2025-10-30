import React, { useState } from 'react';
import api from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setNotice(null);
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      setNotice({ type: 'success', text: res.data?.message || 'Message sent' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      const msg = err?.original?.response?.data?.message || err.message || 'Failed to send message';
      setNotice({ type: 'danger', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="py-5">
        <div className="container" style={{ maxWidth: 800 }}>
          <h3 className="mb-3">Contact</h3>
          <p className="text-muted">Have a question or feedback? Send us a message and we’ll get back to you.</p>
          {notice && <div className={`alert alert-${notice.type}`}>{notice.text}</div>}
          <form className="row g-3" onSubmit={submit}>
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={onChange} required />
            </div>
            <div className="col-12">
              <label className="form-label">Message</label>
              <textarea rows="4" className="form-control" name="message" value={form.message} onChange={onChange} required />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-dark" disabled={loading}>{loading ? 'Sending…' : 'Send Message'}</button>
            </div>
          </form>
        </div>
      </div>
      
    </>
  );
}
