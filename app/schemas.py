from pydantic import BaseModel
from typing import Optional


class JobBase(BaseModel):
    title: str
    description: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None


class JobCreate(JobBase):
    pass


class JobUpdate(JobBase):
    title: Optional[str] = None


class Job(JobBase):
    id: int

    class Config:
        from_attributes = True
