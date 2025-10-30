import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', company: '', location: '', description: '' });

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    const res = await api.get(`/jobs/${id}`);
    setForm(res.data);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (id) await api.put(`/jobs/${id}`, form);
    else await api.post('/jobs', form);
    navigate('/');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h3>{id ? 'Edit Job' : 'Post Job'}</h3>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Company</label>
            <input className="form-control" value={form.company} onChange={e => setForm({...form, company: e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input className="form-control" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={6} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <button className="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
}
