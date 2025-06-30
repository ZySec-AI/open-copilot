from pydantic import BaseModel, Field
from datetime import datetime


class Control(BaseModel):
    name: str
    type: str
    vendor: str = None
    version: str = None
    function: str
    coverage_area: str = None
    implementation_date: datetime
    last_review_date: datetime = None
    compliance_standard: str = None
    frequency: str = None  # e.g., "daily", "weekly", etc.
    effectiveness_rating: str = None  # e.g., "high", "medium", etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
