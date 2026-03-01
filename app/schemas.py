from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


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
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Use Pydantic v2 config style
    model_config = ConfigDict(from_attributes=True)
