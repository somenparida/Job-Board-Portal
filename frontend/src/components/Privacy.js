import React from 'react';

export default function Privacy() {
  return (
    <>
      <div className="py-5">
        <div className="container" style={{ maxWidth: 800 }}>
          <h3 className="mb-3">Privacy Policy</h3>
          <p className="text-muted">We respect your privacy. We only collect the information necessary to provide our service and never sell your data. You can request deletion of your account at any time.</p>
          <ul className="text-muted">
            <li>Authentication uses JWT stored in your browser</li>
            <li>Passwords are hashed with bcrypt</li>
            <li>Cookies/localStorage are used only for session and preferences</li>
          </ul>
        </div>
      </div>
      
    </>
  );
}
