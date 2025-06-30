from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.pydantics import Base
from app.models.pydantics.user_schema import UserBasicInfoResponse


class AppDetails(BaseModel):
    version: str = '1.0.0'
    addition_field: str = 'addition_field'


class Message(BaseModel):
    role: str = 'user'
    content: str = ''


class AppModel(BaseModel):
    chat_id: str = Field(example='662fdfab8541441f1f88d683')
    expert_id: str = Field(example='662fdfab8541441f1f88d683')
    files: List[str] = Field(default=[])
    category_id: Optional[str] = Field(default='')
    stream: bool = False
    appDetails: AppDetails = None
    messages: List[Message]


class ResponseExpert(Base):
    expert_name: str = Field(...)
    type: str = Field(...)
    avatar: str = Field(None)
    files: List[str] = Field(None)
    categories: Optional[List[str]] = Field(None)
    created_by: Optional[UserBasicInfoResponse] = Field(None)
    description: str = Field(None)
    system_prompt: str = Field(None)
    enable_history: bool = Field(False)
    internet_required: bool = Field(False)
    is_active: bool = Field(default=True)
    start_questions: Optional[List[str]] = Field(None)  # New field for start questions
    allowed_apps: Optional[List[str]] = Field(None)  # New field for allowed apps
    model: Optional[str] = Field(None)  # New field for a single model
