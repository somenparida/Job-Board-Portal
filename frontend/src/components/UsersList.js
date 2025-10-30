import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/users', form);
    setForm({ name: '', email: '', password: '', role: 'user' });
    fetchUsers();
  };

  const remove = async (id) => {
    if (!window.confirm('Remove user?')) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <h3>Users</h3>
      <form className="row g-2 mb-3" onSubmit={submit}>
        <div className="col-md-3"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/></div>
        <div className="col-md-3"><input type="email" className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/></div>
        <div className="col-md-2"><input className="form-control" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/></div>
        <div className="col-md-2">
          <select className="form-select" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-md-2"><button className="btn btn-primary">Add</button></div>
      </form>

      <div className="list-group">
        {users.map(u => (
          <div key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{u.name}</strong> <span className="text-muted">{u.email}</span> <span className="badge bg-secondary ms-2">{u.role}</span>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
