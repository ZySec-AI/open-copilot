from pydantic import Field, ConfigDict

from app.models.mongodb import Base


class Folder(Base):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "folder_id": "S293003",
                "name": "project_reports",
                "created_by": "123",
                "parent_folder": "1ac9e1234fgh5678ij90klmn",
                "description": "Project reports for compliance"
            }
        }
    )
    
    name: str = Field(..., example="project_reports")
    created_by: str = Field(..., example="123")
    parent_folder: str = Field(None, example="1ac9e1234fgh5678ij90klmn")
    description: str = Field(None, example="Project reports for compliance")
