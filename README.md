# Backend de Job avec FastAPI

![CI](https://github.com/Anir-kata/job_backend_FastAPI/actions/workflows/ci.yml/badge.svg)

Ce depot contient une application FastAPI simple qui fournit des operations CRUD pour une ressource `Emploi`, supportee par une base de donnees PostgreSQL utilisant SQLAlchemy.

## 📦 Prérequis

- Python 3.9+
- Serveur PostgreSQL fonctionnant localement (la chaîne de connexion par défaut est définie dans `app/database.py`).
- `pip` pour installer les dépendances.

Les dépendances sont listées dans `requirements.txt` et peuvent être installées avec :

```bash
pip install -r requirements.txt
```

> Vous pouvez utiliser un environnement virtuel (`venv`) pour isoler les paquets.

## ⚙️ Configuration

Modifiez la variable `DATABASE_URL` dans `app/database.py` si vous devez changer les détails de connexion. Par défaut, elle pointe vers `postgresql://postgres:anir@localhost:5432/jobdb`.

Créez la base de données dans PostgreSQL avant d'exécuter l'application :

```sql
CREATE DATABASE jobdb;
```

L'application creera automatiquement la table `jobs` au demarrage.

## 🚀 Lancer le serveur

Démarrez le serveur FastAPI avec uvicorn :

```bash
uvicorn app.main:app --reload
```

L'API sera disponible à `http://127.0.0.1:8000` et la documentation interactive à `http://127.0.0.1:8000/docs`.

## 🔁 Points de terminaison CRUD

| Methode | Chemin                 | Description                              |
|---------|------------------------|------------------------------------------|
| POST    | `/emplois/`            | Cree une nouvelle fiche emploi           |
| GET     | `/emplois/`            | Recupere la liste des emplois            |
| GET     | `/emplois/{id}`        | Obtient un emploi specifique par ID      |
| PUT     | `/emplois/{id}`        | Met a jour les champs d'un emploi        |
| DELETE  | `/emplois/{id}`        | Supprime une fiche emploi                |
| GET     | `/emplois/recherche`   | Recherche par `requete` et `entreprise` |
| POST    | `/emplois/lot`         | Creation en lot d'emplois                |

### Exemple de corps de requête pour création/mise à jour

```json
{
  "title": "Software Engineer",
  "description": "Work on backend services",
  "company": "Acme Corp",
  "location": "Remote"
}
```

## ✅ Notes

- Les schémas Pydantic sont définis dans `app/schemas.py`.
- Les modèles SQLAlchemy se trouvent dans `app/models.py`.
- La dépendance de session de base de données est configurée dans `app/main.py`.

Il est possible aussi d'étendre le schéma, ajouter une authentification ou intégrer Alembic pour les migrations.

## 🧪 Tests

Le dossier `tests/` contient des tests qui valident le fonctionnement des routes CRUD.
Ils utilisent une base SQLite en mémoire afin de ne pas toucher à la base Postgres réelle.

Pour exécuter les tests, installez les dépendances et lancez :

```bash
pytest
```

## 🖥 Frontend

Un client React leger est inclus sous `frontend/`. Il consomme les endpoints de l'API pour
créer et lister des emplois, effectuer des recherches et supprimer des entrées.

Pour démarrer l'interface :

```bash
cd frontend
npm install      # ou yarn
npm run dev
```

Visitez ensuite `http://localhost:5173`. Le front-end attend
l'API à `http://127.0.0.1:8000` par défaut.

## ▶ Lancer Backend + Frontend ensemble

Vous pouvez maintenant lancer tout le projet avec une seule commande depuis la racine `job_backend_FastAPI`:

```bash
npm install
npm run dev
```

Cette commande démarre:

- le backend FastAPI sur `http://127.0.0.1:8000`
- le frontend Vite sur `http://localhost:5173`

Scripts disponibles à la racine:

```bash
npm run dev        # backend + frontend en parallèle
npm run build      # build frontend
npm run test       # tests backend puis frontend
```

## 🐳 Utiliser Docker Compose

Pour lancer le projet entièrement dans Docker (avec Postgres inclus):

### Prérequis
- Docker et Docker Compose installés

### Démarrer les services

Depuis la racine du projet:

```bash
docker compose up
```

Ceci va démarrer:
- **PostgreSQL** sur le port `5432` (données stockées dans un volume)
- **Backend FastAPI** sur `http://localhost:8000`
- **Frontend Vite** sur `http://localhost:5173`

Les services sont configurés pour se découvrir automatiquement par le nom du container (`postgres`, `backend`, `frontend`).

### Arrêter les services

```bash
docker compose down
```

Pour supprimer aussi les volumes de données (PostgreSQL):

```bash
docker compose down -v
```

### Logs en direct

Voir tous les logs:

```bash
docker compose logs -f
```

Voir les logs d'un service spécifique:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```


