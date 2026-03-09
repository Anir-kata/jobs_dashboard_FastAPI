# Job Board (FastAPI + React)

![CI](https://github.com/Anir-kata/job_backend_FastAPI/actions/workflows/ci.yml/badge.svg)

Une mini app de gestion d'offres d'emploi.
Avec un vrai flow complet: backend, frontend, tests, Docker, CI.

## Ce que fait le projet

L'app permet de:

- creer une offre d'emploi
- lister les offres
- modifier une offre
- supprimer une offre
- rechercher des offres par mot-cle ou entreprise
- ajouter plusieurs offres en lot

Le backend est en FastAPI + SQLAlchemy.
Le frontend est en React (Vite) et consomme l'API.

## Lancer en local

### Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: `http://127.0.0.1:8000`
Docs auto FastAPI: `http://127.0.0.1:8000/docs`

Par defaut, la base vise Postgres via `DATABASE_URL` dans `app/database.py`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

### Tout lancer depuis la racine

```bash
npm install
npm run dev
```

Scripts utiles:

```bash
npm run dev
npm run build
npm run test
```

## API (principaux endpoints)

| Methode | Route                | Usage |
|---------|----------------------|-------|
| POST    | `/emplois/`          | Creer une offre |
| GET     | `/emplois/`          | Lister les offres |
| GET     | `/emplois/{id}`      | Recuperer une offre |
| PUT     | `/emplois/{id}`      | Modifier une offre |
| DELETE  | `/emplois/{id}`      | Supprimer une offre |
| GET     | `/emplois/recherche` | Rechercher |
| POST    | `/emplois/lot`       | Creation en lot |

Exemple de payload:

```json
{
  "title": "Software Engineer",
  "description": "Work on backend services",
  "company": "Acme Corp",
  "location": "Remote"
}
```

## Tests

Les tests sont dans `tests/` et tournent avec `pytest`.
Ils utilisent une config SQLite dediee pour ne pas dependre de Postgres en CI.

```bash
pytest -q
```

## Docker

Pour lancer tout le projet (Postgres + backend + frontend):

```bash
docker compose up
```

Arreter:

```bash
docker compose down
```

Supprimer aussi le volume Postgres:

```bash
docker compose down -v
```

Voir les logs:

```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

## Suite possible
- authentification JWT
- pagination / tri plus avances
- migrations Alembic
- un petit dashboard de stats


