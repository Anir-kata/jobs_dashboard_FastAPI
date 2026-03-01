# Backend de Job avec FastAPI

Ce dépôt contient une application FastAPI simple qui fournit des opérations CRUD pour une ressource `Job`, supportée par une base de données PostgreSQL utilisant SQLAlchemy.

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

L'application créera automatiquement la table `jobs` au démarrage.

## 🚀 Lancer le serveur

Démarrez le serveur FastAPI avec uvicorn :

```bash
uvicorn app.main:app --reload
```

L'API sera disponible à `http://127.0.0.1:8000` et la documentation interactive à `http://127.0.0.1:8000/docs`.

## 🔁 Points de terminaison CRUD

| Méthode | Chemin            | Description                         |
|---------|-------------------|-------------------------------------|
| POST    | `/jobs/`          | Crée une nouvelle fiche de job      |
| GET     | `/jobs/`          | Récupère la liste des jobs          |
| GET     | `/jobs/{id}`      | Obtient un job spécifique par ID    |
| PUT     | `/jobs/{id}`      | Met à jour les champs d'un job      |
| DELETE  | `/jobs/{id}`      | Supprime une fiche de job           |

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

N'hésitez pas à étendre le schéma, ajouter une authentification ou intégrer Alembic pour les migrations !

## 🧪 Tests

Le dossier `tests/` contient des tests qui valident le fonctionnement des routes CRUD.
Ils utilisent une base SQLite en mémoire afin de ne pas toucher à la base Postgres réelle.

Pour exécuter les tests, installez les dépendances et lancez :

```bash
pytest
```

