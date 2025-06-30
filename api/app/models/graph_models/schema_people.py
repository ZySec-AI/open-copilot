from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class Person(BaseModel):
    name: str
    title: str = None
    role: str
    department: str
    email: str
    phone: str
    start_date: datetime
    end_date: Optional[datetime] = None
    access_level: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
