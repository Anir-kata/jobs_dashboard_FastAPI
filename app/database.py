from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = "postgresql://postgres:anir@localhost:5432/jobdb"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    """Yield a database session. Used as FastAPI dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
