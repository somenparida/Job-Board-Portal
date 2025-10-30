# Deployment guide — GitHub + Render.com

This repository contains a MERN job board with two subfolders: `backend/` and `frontend/`.

This document explains how to create a new GitHub repository, push this code, and deploy both services on Render.com.

Prerequisites
- A GitHub account
- A Render.com account (you can sign in with GitHub)
- (Recommended) A MongoDB instance (Atlas is easiest for production)

1) Create a GitHub repository

- On GitHub, create a new repository (e.g. `your-username/job-portal`).
- Locally, in the project root run:

```powershell
cd "c:\job board application"
git init
git add .
git commit -m "Initial commit - job portal"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO>.git
git push -u origin main
```

Replace `<YOUR_USERNAME>` and `<REPO>` with your GitHub username and repo name.

2) Prepare environment variables

- Backend required env vars (set these on Render for the backend service):
  - `MONGO_URI` — your MongoDB connection string (example: `mongodb+srv://user:pass@cluster.mongodb.net/job-portal?retryWrites=true&w=majority`).
  - `JWT_SECRET` — a random secret used to sign JWTs.

- Frontend env var (set this on Render for the static site service):
  - `REACT_APP_API_URL` — the public URL of your backend including `/api` (example: `https://job-portal-backend.onrender.com/api`).

Recommendation: use MongoDB Atlas for a managed DB. After creating an Atlas cluster, whitelist Render's IPs or allow access from anywhere (0.0.0.0/0) for quick tests.

3) Deploy to Render.com

- Sign in to Render and click "New +" → "Web Service".
  - Connect your GitHub repository and choose the `main` branch.
  - Build Command: `cd backend && npm ci`
  - Start Command: `cd backend && npm run start`
  - Environment: `Node`.
  - Add the environment variables `MONGO_URI` and `JWT_SECRET` under the "Environment" section (use Render secrets if you prefer).

- Then click "New +" → "Static Site" for the frontend.
  - Connect the same GitHub repo and branch.
  - Build Command: `cd frontend && npm ci && npm run build`
  - Publish Directory: `frontend/build`
  - Add `REACT_APP_API_URL` in the environment variables, pointing to the backend's public URL + `/api`.

4) Post-deploy

- After the services finish building, open the backend URL and hit `/api/health` to verify it's up.
- Visit the frontend URL and verify the site loads and that jobs load from the API.

Tips & troubleshooting
- If CORS issues appear, ensure your backend CORS configuration allows the frontend origin (Render should give you the frontend URL).
- For testing, you can use a free tier MongoDB Atlas cluster and set `MONGO_URI` accordingly.
- If build fails on Render, check build logs; sometimes installing optional native modules fails — switch to `npm ci` in build commands is recommended.

If you want, I can prepare a GitHub-friendly README, create a `render.yaml` manifest (already included), or craft a Dockerfile if you'd rather deploy via Docker.
