from typing import Optional, List

from pydantic import Field, BaseModel, ConfigDict

from app.models.pydantics import Base
from app.models.pydantics.category_schema import ResponseCategory
from app.models.pydantics.user_schema import UserBasicInfoResponse
from app.utils.app_enums import ContentItemType


class RequestContentItem(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'name': 'Content Item Name',
                'description': 'Content Item Description',
                'tags': ['tag1', 'tag2'],
                'version': '1.0.0',
                'category': '1ac9e1234fgh5678ij90klmn',
                'content_type': 'playbooks'
            }
        }
    )
    
    name: Optional[str] = Field(...)
    description: Optional[str] = Field(None)
    content: Optional[str] = Field(None)
    tags: Optional[List[str]] = Field(default=[])
    version: Optional[str] = Field(None)
    category: Optional[str] = Field(None)
    content_type: Optional[ContentItemType] = Field(None)


class ResponseContentItem(Base):
    name: str = Field(...)
    description: Optional[str] = Field(None)
    content: Optional[str] = Field(None)
    tags: List[str] = Field(default=[])
    version: Optional[str] = Field(None)
    created_by: UserBasicInfoResponse = Field(None)
    updated_by: UserBasicInfoResponse = Field(None)
    category: ResponseCategory = Field(None)
    content_type: ContentItemType = Field(None)
