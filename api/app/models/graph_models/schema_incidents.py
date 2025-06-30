from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class Incident(BaseModel):
    description: str
    severity: str
    start_time: datetime
    end_time: datetime = None
    detection_method: str
    containment_actions: List[str] = []
    recovery_actions: List[str] = []
    impacted_assets: List[str] = []
    resolution_status: str
    root_cause: str = None
    source_ip: str = None
    target_ip: str = None
    status: str = "new"
    time_to_detect: float = None
    time_to_contain: float = None
    time_to_resolve: float = None
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
