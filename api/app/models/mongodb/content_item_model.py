from typing import Optional, List

from pydantic import Field

from app.models.mongodb import Base


class ContentItem(Base):
    name: str = Field(...)
    description: Optional[str] = Field(None)
    content: Optional[str] = Field(None)
    tags: List[str] = Field(default=[])
    version: Optional[str] = Field(None)
    category: str = Field(None)
    created_by: Optional[str] = Field(None)
    updated_by: Optional[str] = Field(None)
    content_type: Optional[str] = Field(None)
