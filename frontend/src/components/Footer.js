import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-top mt-5 py-4 small text-muted">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="fw-semibold mb-2">JobBoard</div>
            <div>Find your dream job or post opportunities for talented professionals.</div>
          </div>
          <div className="col-md-3">
            <div className="fw-semibold mb-2">For Job Seekers</div>
            <ul className="list-unstyled">
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <div className="fw-semibold mb-2">For Employers</div>
            <ul className="list-unstyled">
              <li><Link to="/admin/jobs/new">Post a Job</Link></li>
              <li><Link to="/admin">Manage Postings</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <div className="fw-semibold mb-2">Company</div>
            <ul className="list-unstyled">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4">© {new Date().getFullYear()} JobBoard. All rights reserved.</div>
      </div>
    </footer>
  );
}
