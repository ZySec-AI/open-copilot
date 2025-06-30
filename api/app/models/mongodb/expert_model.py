from typing import List, Optional
from pydantic import Field
from app.models.mongodb import Base


class Expert(Base):
    expert_name: str = Field(...)
    type: str = Field(default='app')
    avatar: Optional[str] = Field(None)
    description: Optional[str] = Field(None)
    system_prompt: Optional[str] = Field(None)
    enable_history: bool = Field(False)
    internet_required: bool = Field(False)
    files: Optional[List[str]] = Field(None)
    categories: Optional[List[str]] = Field(None)
    created_by: str = Field(None)
    is_active: bool = Field(default=True)
    start_questions: Optional[List[str]] = Field(None)  # New field for start questions
    allowed_apps: Optional[List[str]] = Field(None)  # New field for allowed apps
    model: Optional[str] = Field(None)  # New field for a single model
