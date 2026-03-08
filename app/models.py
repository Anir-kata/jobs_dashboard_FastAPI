from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base


class Emploi(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    company = Column(String, nullable=True)
    location = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


# Alias de compatibilite pour l'ancien nom du modele.
Job = Emploi
