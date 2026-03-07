# Docker Quick Reference

## Start Everything (Postgres + Backend + Frontend)
```bash
docker compose up
```

## Start in Background (Detached)
```bash
docker compose up -d
```

## Stop All Services
```bash
docker compose down
```

## Stop and Remove Volumes (PostgreSQL data)
```bash
docker compose down -v
```

## View Logs (All Services)
```bash
docker compose logs -f
```

## View Logs (Specific Service)
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

## Rebuild Containers After Code Changes
```bash
docker compose up --build
```

## Access Running Container Shell
```bash
docker exec -it job_backend bash
docker exec -it job_postgres psql -U postgres -d jobdb
```

## Service URLs
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Frontend: http://localhost:5173
- Postgres: localhost:5432

## Environment Variables
Backend reads `DATABASE_URL` from environment (set in docker-compose.yml).
Frontend reads `VITE_API_URL` at build time.
