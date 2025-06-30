from pydantic import BaseModel, Field
from datetime import datetime


class Threat(BaseModel):
    name: str
    description: str
    type: str
    potential_impact: str
    likelihood: str
    external_reference: str = None
    first_seen: datetime
    last_seen: datetime = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
