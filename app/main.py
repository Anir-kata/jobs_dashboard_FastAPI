import logging
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from contextlib import asynccontextmanager

from . import models, schemas, database

# setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# middleware to log incoming requests

async def log_request(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    # create tables on startup
    models.Base.metadata.create_all(bind=database.engine)
    yield


app = FastAPI(lifespan=lifespan)
# add middleware
app.middleware('http')(log_request)
# allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use the shared database dependency from `app.database` so tests can override it
from .database import get_db


@app.get("/", tags=["root"])
def read_root():
    return {"message": "Job Data Pipeline is running"}


@app.post("/jobs/", response_model=schemas.Job, tags=["jobs"])
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    db_job = models.Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


@app.get("/jobs/", response_model=list[schemas.Job], tags=["jobs"])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(models.Job).offset(skip).limit(limit)
    return db.execute(stmt).scalars().all()


@app.get("/jobs/search", response_model=list[schemas.Job], tags=["jobs"])
def search_jobs(query: str | None = None, company: str | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(models.Job)
    if query:
        stmt = stmt.where(models.Job.title.contains(query))
    if company:
        stmt = stmt.where(models.Job.company == company)
    stmt = stmt.offset(skip).limit(limit)
    return db.execute(stmt).scalars().all()


@app.post("/jobs/bulk", response_model=list[schemas.Job], tags=["jobs"])
def bulk_create_jobs(jobs: list[schemas.JobCreate], db: Session = Depends(get_db)):
    objs = [models.Job(**j.model_dump()) for j in jobs]
    db.add_all(objs)
    db.commit()
    for o in objs:
        db.refresh(o)
    return objs


@app.get("/jobs/{job_id}", response_model=schemas.Job, tags=["jobs"])
def read_job(job_id: int, db: Session = Depends(get_db)):
    job = db.get(models.Job, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@app.put("/jobs/{job_id}", response_model=schemas.Job, tags=["jobs"])
def update_job(job_id: int, job_update: schemas.JobUpdate, db: Session = Depends(get_db)):
    job = db.get(models.Job, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    update_data = job_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@app.delete("/jobs/{job_id}", tags=["jobs"])
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.get(models.Job, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"ok": True}