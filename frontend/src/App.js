import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './components/Landing';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import JobsList from './components/JobsList';
import JobForm from './components/JobForm';
import JobDetails from './components/JobDetails';
import UsersList from './components/UsersList';
import AdminJobs from './components/AdminJobs';
import AdminApplications from './components/AdminApplications';
import AdminContactMessages from './components/AdminContactMessages';
import ChangePassword from './components/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';
import auth from './services/auth';
import About from './components/About';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import Footer  from './components/Footer';


function App() {
  const [user, setUser] = useState(auth.getUser());

  useEffect(() => {
    const u = auth.getUser();
    setUser(u);
  }, []);

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="container mt-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Landing user={user} />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />

            <Route
              path="/admin"
              element={<ProtectedRoute user={user} role="admin"><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/jobs"
              element={<ProtectedRoute user={user} role="admin"><AdminJobs /></ProtectedRoute>}
            />
            <Route
              path="/admin/jobs/new"
              element={<ProtectedRoute user={user} role="admin"><JobForm /></ProtectedRoute>}
            />
            <Route
              path="/admin/jobs/:id/edit"
              element={<ProtectedRoute user={user} role="admin"><JobForm /></ProtectedRoute>}
            />
            <Route
              path="/admin/users"
              element={<ProtectedRoute user={user} role="admin"><UsersList /></ProtectedRoute>}
            />
            <Route
              path="/admin/applications"
              element={<ProtectedRoute user={user} role="admin"><AdminApplications /></ProtectedRoute>}
            />
            <Route
              path="/admin/messages"
              element={<ProtectedRoute user={user} role="admin"><AdminContactMessages /></ProtectedRoute>}
            />

            <Route
              path="/dashboard"
              element={<ProtectedRoute user={user} role="user"><UserDashboard /></ProtectedRoute>}
            />

            <Route
              path="/change-password"
              element={<ProtectedRoute user={user}><ChangePassword /></ProtectedRoute>}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
