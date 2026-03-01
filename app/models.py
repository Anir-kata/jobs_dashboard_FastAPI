from sqlalchemy import Column, Integer, String, Text
from .database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    company = Column(String, nullable=True)
    location = Column(String, nullable=True)
