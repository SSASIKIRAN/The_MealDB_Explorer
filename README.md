# TheMealDB Explorer

## Overview
This project contains two parts:
- `backend/` — Node.js + Express web service exposing simplified endpoints and caching.
- `frontend/` — React + Vite UI that consumes the backend.

## Run locally

1. Clone the repo
2. Start backend
   - cd backend
   - cp .env.example .env
   - npm install
   - npm run dev

3. Start frontend
   - cd frontend
   - npm install
   - npm run dev

Open http://localhost:3000 in the browser.

## Notes
- The backend caches responses in memory using an LRU cache. Set `USE_REDIS=true` and `REDIS_URL` in backend/.env to use Redis.
- TheMealDB test key `1` is preconfigured. For production, request a real API key.
