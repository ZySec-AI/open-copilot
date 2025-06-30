from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class Asset(BaseModel):
    name: str
    type: str
    subtype: str = None
    serial_number: str = None
    criticality: str
    owner_id: str      # Link to Person
    department: str
    business_value: str = None
    confidentiality_level: str
    security_controls: List[str] = []
    vulnerability_status: str
    location: str
    value: str
    purchase_date: datetime
    end_of_life: datetime = None
    last_vulnerability_scan_date: datetime = None
    ip_address: str = None
    hostname: str = None
    operating_system: str = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
