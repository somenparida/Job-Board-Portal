import React, { useState } from 'react';
import api from '../services/api';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await api.post('/auth/change-password', { currentPassword, newPassword });
      setMsg({ type: 'success', text: res.data.message });
      setCurrentPassword(''); setNewPassword('');
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Error' });
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Change Password</h3>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-control" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary">Change</button>
        </form>
      </div>
    </div>
  );
}
