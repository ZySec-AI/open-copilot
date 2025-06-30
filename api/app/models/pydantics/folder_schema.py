from typing import Optional

from pydantic import Field, BaseModel

from app.models.pydantics import Base
from app.models.pydantics.user_schema import UserBasicInfoResponse


class RequestFolder(BaseModel):
    name: str = Field(..., example="project_reports")
    parent_folder: str = Field(None, example="1ac9e1234fgh5678ij90klmn")
    description: str = Field(None, example="Project reports for compliance")


class ResponseFolder(Base):
    id: str = Field(..., example="1ac9e1234fgh5678ij90klmn")
    name: str = Field(..., example="project_reports")
    created_by: Optional[UserBasicInfoResponse] = Field(..., example="123")
    children: list = Field(None, example=[])
    description: str = Field(None, example="Project reports for compliance")
