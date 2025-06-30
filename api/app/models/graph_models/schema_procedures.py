from pydantic import BaseModel, Field
from datetime import datetime
from typing import List


class Procedure(BaseModel):
    name: str
    description: str
    responsible_party_id: str = None  # Link to Person
    steps: List[str]
    version_history: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
