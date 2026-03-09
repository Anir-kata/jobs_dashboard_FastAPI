from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:anir@localhost:5432/jobdb')

engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    # Allow SQLite connections across threads used by FastAPI TestClient.
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    """Fournit une session de base de donnees, utilisee comme dependance FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
