from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class Base(BaseModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
