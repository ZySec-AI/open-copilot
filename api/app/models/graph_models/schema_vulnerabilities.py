from pydantic import BaseModel, Field
from datetime import datetime
from typing import List


class Vulnerability(BaseModel):
    description: str
    severity: str
    cvss_score: float
    published_date: datetime
    last_modified_date: datetime
    discovery_date: datetime = None
    patch_available_date: datetime = None
    associated_cves: List[str] = []
    cve_id: str = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
