from datetime import datetime

from pydantic import BaseModel, Field


class BusinessProcess(BaseModel):
    name: str
    description: str
    criticality: str
    relevant_assets: str  # Assuming list of Asset IDs
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
