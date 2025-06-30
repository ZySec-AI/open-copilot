from pydantic import BaseModel, Field
from datetime import datetime


class Risk(BaseModel):
    description: str
    likelihood: str
    impact: str
    mitigation_strategy: str = None
    residual_risk: str = None
    risk_score: float = None
    responsible_party_id: str = None  # Link to Person
    status: str = "open"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
