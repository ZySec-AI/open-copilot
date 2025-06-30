from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class Assessment(BaseModel):
    name: str
    description: str
    responsible_party_id: str = None  # Link to Person
    findings: List[str]
    recommendations: List[str]
    assessment_date: datetime
    assessment_tools: List[str]
    assessor: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
