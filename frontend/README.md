Front-end React app (Vite)

Quick start:

```bash
cd frontend
npm install
npm run dev
```

By default the front-end expects the API at `http://127.0.0.1:8000`. To change, set `VITE_API_URL` in your environment (for example: `export VITE_API_URL=https://api.example.com`).

Pages/components:
- `JobForm` — create job and bulk-add sample jobs
- `JobList` — list, search, and delete jobs
