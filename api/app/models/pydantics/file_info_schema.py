from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.models.pydantics.category_schema import ResponseCategory
from app.models.pydantics.folder_schema import ResponseFolder
from app.models.pydantics.user_schema import UserBasicInfoResponse


class EmbeddedStatus(BaseModel):
    # Assuming structure of EmbeddedStatus is defined here
    model: str
    dim: Optional[int] = None
    status: bool
    indexed_time: datetime


class FileUploadInfo(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "filename": "project_overview.pdf",
                "description": "Detailed project overview and specifications",
                "tags": ["Q2", "2024", "planning"],
                "embedded_status": [
                    {
                        "model": "all-minilm-l6-v2",
                        "dim": 768,
                        "status": True,
                        "indexed_time": "2024-04-05T09:00:00"
                    }
                ],
                "categories": ["6613c98b1ea6653794d4155a", "planning"]
            }
        }
    )
    
    filename: str
    description: str
    tags: Optional[List[str]] = None
    embedded_status: List[EmbeddedStatus]
    categories: Optional[List[str]] = None


class ResponseFileInfo(BaseModel):
    id: str
    filename: str
    description: str = None
    uploaded_first_time: datetime
    uploaded_by: UserBasicInfoResponse
    sha256_hash: str
    deleted: bool = False
    file_size: int
    file_ext: str
    path: str
    folder: ResponseFolder = None
    tags: List[str] = None
    embedded_status: List[EmbeddedStatus] = None
    categories: List[ResponseCategory] = None
