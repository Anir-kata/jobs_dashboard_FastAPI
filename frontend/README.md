Application front-end React (Vite)

Demarrage rapide:

```bash
cd frontend
npm install
npm run dev
```

Par defaut, le front-end attend l'API a `http://127.0.0.1:8000`. Pour changer, definissez `VITE_API_URL` dans votre environnement (par exemple: `export VITE_API_URL=https://api.example.com`).

Pages/composants:
- `JobForm` - creer un emploi et ajouter des emplois exemples en lot
- `JobList` - lister, rechercher et supprimer des emplois
