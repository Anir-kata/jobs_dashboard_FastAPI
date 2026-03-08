from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class EmploiBase(BaseModel):
    title: str
    description: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None


class CreationEmploi(EmploiBase):
    pass


class MiseAJourEmploi(EmploiBase):
    title: Optional[str] = None


class Emploi(EmploiBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Style de configuration Pydantic v2.
    model_config = ConfigDict(from_attributes=True)


# Alias de compatibilite pour les anciens noms.
JobBase = EmploiBase
JobCreate = CreationEmploi
JobUpdate = MiseAJourEmploi
Job = Emploi
