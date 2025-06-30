from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class Policy(BaseModel):
    name: str
    description: str
    related_regulations: List[str] = []
    responsible_party_id: str = None  # Link to Person
    review_date: datetime = None
    version_history: List[str] = []  # List of past versions
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
