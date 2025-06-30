from pydantic import BaseModel, Field
from datetime import datetime
from typing import List


class Shift(BaseModel):
    name: str
    start_time: datetime
    end_time: datetime
    date: datetime
    assigned_people: List[str] = []  # Link to list of Persons
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
