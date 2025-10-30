Job Portal Backend

This folder contains an Express + MongoDB backend for a role-based job portal.

Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

   npm install

3. Start in development mode:

   npm run dev

APIs

- POST /api/auth/register - register new user (body: name, email, password, role)
- POST /api/auth/login - login (body: email, password)
- POST /api/auth/change-password - change password (authenticated)
- GET /api/users - (admin) list users
- POST /api/users - (admin) create user
- PUT /api/users/:id - (admin) update user
- DELETE /api/users/:id - (admin) delete user
- GET /api/jobs - public list of jobs (query q, company, location)
- GET /api/jobs/:id - public job details
- POST /api/jobs - (admin) create job
- PUT /api/jobs/:id - (admin) update job
- DELETE /api/jobs/:id - (admin) delete job

Notes

- JWT based auth; include header `Authorization: Bearer <token>` for protected endpoints.
- Passwords are hashed with bcrypt.
