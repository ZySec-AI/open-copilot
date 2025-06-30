from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict

from app.core.config import config


class EmbeddedStatus(BaseModel):
    model: str = Field(config.langchain_model)
    dim: Optional[int] = Field(None)
    status: bool = Field(False)
    indexed_time: datetime = Field(default_factory=datetime.utcnow)


class FileInfo(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "filename": "project_overview.pdf",
                "description": "Detailed project overview and specifications",
                "uploaded_first_time": "2024-04-05T09:00:00",
                "uploaded_by_user_id": "123",
                "sha256_hash": "9c8a5f4c6e8a5f6e7f8d9c8b0a12345ef6gh7890i1j2k34l5m6n7o8p9q0r1st2",
                "deleted": False,
                "file_size": 204800,
                "file_ext": ".pdf",
                "path": "/assets/files/S293003.pdf",
                "folder": "/compliance/project_reports",
                "tags": ["Q2", "2024", "planning"],
                "embedded_status": [
                    {
                        "model": "all-minilm-l6-v2",
                        "dim": 768,
                        "status": True,
                        "indexed_time": "2024-04-05T09:00:00"
                    }
                ],
                "categories": ["strategy", "planning"]
            }
        }
    )
    
    filename: str = Field(..., example="project_overview.pdf")
    description: str = Field(None, example="Detailed project overview and specifications")
    uploaded_first_time: datetime = Field(default_factory=datetime.utcnow, example="2024-04-05T09:00:00")
    uploaded_by_user_id: str = Field(..., example="123")
    sha256_hash: str = Field(None, example="9c8a5f4c6e8a5f6e7f8d9c8b0a12345ef6gh7890i1j2k34l5m6n7o8p9q0r1st2")
    deleted: bool = Field(default=False, example=False)
    file_size: int = Field(..., example=204800)
    file_ext: str = Field(..., example=".pdf")
    path: str = Field(None, example="/assets/files/S293003.pdf")
    folder: str = Field(None, example="1dw3e4r5t6y7u8i9o0p")
    tags: List[str] = Field(None, example=["Q2", "2024", "planning"])
    embedded_status: List[EmbeddedStatus] = Field(
        None, example=[{"model": "all-minilm-l6-v2", "dim": 768, "status": True,
                        "indexed_time": "2024-04-05T09:00:00"}]
    )
    categories: List[str] = Field(None, example=["1dw3e4r5t6y7u8i9o0p", "1dw3e4r5t6y7u8i9o0p"])
