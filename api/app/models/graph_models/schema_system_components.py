from pydantic import BaseModel, Field
from datetime import datetime


class SystemComponent(BaseModel):
    name: str
    type: str
    description: str = None
    vendor: str = None
    version: str = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
