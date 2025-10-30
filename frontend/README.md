Job Portal Frontend

This folder contains a React + Bootstrap frontend for the job portal.

Quick start

1. Install dependencies:

   npm install

2. Start dev server:

   npm start

Environment

- If your backend is not at the default `http://localhost:5000/api`, set `REACT_APP_API_URL` in your environment (or `.env`) to point to the API base URL.

Notes

- The scaffold supports register/login/logout, role-based routes (Admin vs User), job list/details, admin job CRUD and user management.
- Token is stored in localStorage and automatically attached to requests.
- This is a minimal scaffold to get started; consider adding input validation, better error handling, and form UX improvements.
