from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class Base(BaseModel):
    id: str = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Detail(BaseModel):
    detail: str
