import logging
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from contextlib import asynccontextmanager

from . import models, schemas, database

# Configuration de base des logs.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Middleware de journalisation des requetes entrantes.

async def log_request(request: Request, call_next):
    logger.info(f"Requete: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Statut reponse: {response.status_code}")
    return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Cree les tables au demarrage.
    models.Base.metadata.create_all(bind=database.engine)
    yield


app = FastAPI(lifespan=lifespan)
# Ajoute le middleware HTTP de log.
app.middleware('http')(log_request)
# Autorise CORS pour le frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utilise la dependance de base de donnees partagee pour les tests.
from .database import get_db


@app.get("/", tags=["root"])
def read_root():
    return {"message": "Le pipeline de donnees emploi est actif"}


@app.post("/emplois/", response_model=schemas.Emploi, tags=["emplois"])
@app.post("/jobs/", response_model=schemas.Emploi, tags=["emplois"], include_in_schema=False)
def creer_emploi(emploi: schemas.CreationEmploi, db: Session = Depends(get_db)):
    db_emploi = models.Emploi(**emploi.model_dump())
    db.add(db_emploi)
    db.commit()
    db.refresh(db_emploi)
    return db_emploi


@app.get("/emplois/", response_model=list[schemas.Emploi], tags=["emplois"])
@app.get("/jobs/", response_model=list[schemas.Emploi], tags=["emplois"], include_in_schema=False)
def lire_emplois(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(models.Emploi).offset(skip).limit(limit)
    return db.execute(stmt).scalars().all()


@app.get("/emplois/recherche", response_model=list[schemas.Emploi], tags=["emplois"])
@app.get("/jobs/search", response_model=list[schemas.Emploi], tags=["emplois"], include_in_schema=False)
def rechercher_emplois(
    requete: str | None = None,
    entreprise: str | None = None,
    query: str | None = None,
    company: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    stmt = select(models.Emploi)
    valeur_recherche = requete or query
    valeur_entreprise = entreprise or company
    if valeur_recherche:
        stmt = stmt.where(models.Emploi.title.contains(valeur_recherche))
    if valeur_entreprise:
        stmt = stmt.where(models.Emploi.company == valeur_entreprise)
    stmt = stmt.offset(skip).limit(limit)
    return db.execute(stmt).scalars().all()


@app.post("/emplois/lot", response_model=list[schemas.Emploi], tags=["emplois"])
@app.post("/jobs/bulk", response_model=list[schemas.Emploi], tags=["emplois"], include_in_schema=False)
def creer_emplois_lot(emplois: list[schemas.CreationEmploi], db: Session = Depends(get_db)):
    objs = [models.Emploi(**e.model_dump()) for e in emplois]
    db.add_all(objs)
    db.commit()
    for o in objs:
        db.refresh(o)
    return objs


@app.get("/emplois/{emploi_id}", response_model=schemas.Emploi, tags=["emplois"])
@app.get("/jobs/{emploi_id}", response_model=schemas.Emploi, tags=["emplois"], include_in_schema=False)
def lire_emploi(emploi_id: int, db: Session = Depends(get_db)):
    emploi = db.get(models.Emploi, emploi_id)
    if emploi is None:
        raise HTTPException(status_code=404, detail="Emploi introuvable")
    return emploi


@app.put("/emplois/{emploi_id}", response_model=schemas.Emploi, tags=["emplois"])
@app.put("/jobs/{emploi_id}", response_model=schemas.Emploi, tags=["emplois"], include_in_schema=False)
def mettre_a_jour_emploi(emploi_id: int, emploi_update: schemas.MiseAJourEmploi, db: Session = Depends(get_db)):
    emploi = db.get(models.Emploi, emploi_id)
    if emploi is None:
        raise HTTPException(status_code=404, detail="Emploi introuvable")
    update_data = emploi_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(emploi, key, value)
    db.add(emploi)
    db.commit()
    db.refresh(emploi)
    return emploi


@app.delete("/emplois/{emploi_id}", tags=["emplois"])
@app.delete("/jobs/{emploi_id}", tags=["emplois"], include_in_schema=False)
def supprimer_emploi(emploi_id: int, db: Session = Depends(get_db)):
    emploi = db.get(models.Emploi, emploi_id)
    if emploi is None:
        raise HTTPException(status_code=404, detail="Emploi introuvable")
    db.delete(emploi)
    db.commit()
    return {"succes": True}