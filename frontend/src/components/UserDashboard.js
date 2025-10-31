import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import auth from '../services/auth';
import UserLayout from './UserLayout';
import '../user.css';

const fmt = (n) => new Intl.NumberFormat().format(n || 0);

export default function UserDashboard() {
  const user = auth.getUser() || { name: 'User' };
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myApps, setMyApps] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [j, a] = await Promise.all([
          api.get('/jobs'),
          api.get('/applications/my').catch(() => ({ data: [] })),
        ]);
        setJobs(j.data || []);
        setMyApps(a.data || []);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const activeJobs = jobs.length;
  const savedJobs = 0; // hook up to saved feature when available
  const applicationsTotal = myApps.length; // real count from /applications/my
  const profileViews = 0; // placeholder metric

  const recentApps = useMemo(() => {
    if (!myApps.length) return [];
    return myApps.slice(0, 3).map((a, i) => ({
      title: a.job?.title || 'Applied Job',
      company: a.job?.company || '',
      location: a.job?.location || '',
      salary: a.job?.salary || '',
      status: i === 0 ? 'Under Review' : i === 1 ? 'Interview Scheduled' : 'Pending',
      posted: new Date(a.createdAt).toLocaleDateString(),
    }));
  }, [myApps]);

  const recommended = useMemo(() => jobs.slice(0, 2), [jobs]);

  return (
    <UserLayout>
      <div className="mb-3">
        <h3 className="mb-1">Welcome back, {user.name?.split(' ')[0] || 'User'}!</h3>
        <div className="u-subtitle">Here's your job search overview</div>
      </div>

      {/* Top stats */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-sm-6">
          <div className="u-card u-stat"><div className="u-card-body">
            <div className="u-subtitle mb-2">Applications</div>
            <h1>{fmt(applicationsTotal)}</h1>
            <div className="u-subtitle">+3 this week</div>
          </div></div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="u-card u-stat"><div className="u-card-body">
            <div className="u-subtitle mb-2">Saved Jobs</div>
            <h1>{fmt(savedJobs)}</h1>
            <div className="u-subtitle">Jobs bookmarked</div>
          </div></div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="u-card u-stat"><div className="u-card-body">
            <div className="u-subtitle mb-2">Profile views</div>
            <h1>{fmt(profileViews)}</h1>
            <div className="u-subtitle">+12 this month</div>
          </div></div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="u-card u-stat"><div className="u-card-body">
            <div className="u-subtitle mb-2">Active Jobs</div>
            <h1>{fmt(activeJobs)}</h1>
            <div className="u-subtitle">+23 new today</div>
          </div></div>
        </div>
      </div>

      <div className="row g-3">
        {/* Recent Applications */}
        <div className="col-lg-7">
          <div className="u-card"><div className="u-card-body">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <div className="u-section-title">Recent Applications</div>
                <div className="u-subtitle">Track your application status</div>
              </div>
              <a className="text-decoration-none" href="#">View All</a>
            </div>

            <div className="d-flex flex-column gap-3">
              {recentApps.map((a, idx) => (
                <div key={idx} className="u-job-card">
                  <div className="fw-semibold">{a.title}</div>
                  <div className="u-job-meta mb-2">{a.company} · {a.location} · {a.salary}</div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="u-job-meta">Applied {a.posted}</div>
                      <span className={`u-chip ${a.status==='Under Review' ? 'dark' : a.status==='Pending' ? 'gray' : 'light'}`} style={{whiteSpace:'nowrap'}}>{a.status}</span>
                  </div>
                </div>
              ))}
              {recentApps.length === 0 && (<div className="u-job-meta">{loading ? 'Loading…' : 'No applications yet'}</div>)}
            </div>
          </div></div>
        </div>

        {/* Recommended Jobs */}
        <div className="col-lg-5">
          <div className="u-card"><div className="u-card-body">
            <div className="u-section-title mb-2">Recommended Jobs</div>
            <div className="u-subtitle mb-3">Based on your profile</div>

            <div className="d-flex flex-column gap-3">
              {recommended.map((j) => (
                <div key={j._id} className="u-job-card">
                  <div className="fw-semibold">{j.title}</div>
                  <div className="u-job-meta mb-2">{j.company} · {j.location} · {j.salary}</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <button className="u-apply-bar">Apply Now</button>
                    <span className="u-chip gray" style={{whiteSpace:'nowrap'}}>Full-time</span>
                  </div>
                </div>
              ))}
              {recommended.length === 0 && (<div className="u-job-meta">{loading ? 'Loading…' : 'No recommendations yet'}</div>)}
            </div>
          </div></div>
        </div>
      </div>
    </UserLayout>
  );
}
