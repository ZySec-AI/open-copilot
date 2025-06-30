from pydantic import BaseModel, Field
from typing import Optional


class Relationship(BaseModel):
    start_node_element_id: str
    start_node_label: Optional[str] = None
    end_node_element_id: str
    end_node_label: Optional[str] = None
    relationship_type: str
    properties: dict = Field(default_factory=dict)
