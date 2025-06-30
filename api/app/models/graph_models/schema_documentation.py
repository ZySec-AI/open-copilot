from datetime import datetime

from pydantic import BaseModel, Field


class Documentation(BaseModel):
    name: str
    type: str
    description: str = None
    content: str  # Or bytes if storing binary data
    responsible_party_id: str = None  # Link to Person
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
