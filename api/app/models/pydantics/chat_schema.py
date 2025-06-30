from typing import List

from pydantic import Field, BaseModel

from app.models.pydantics import Base


class RequestChat(BaseModel):
    chat_name: str = Field(...)


class ResponseChat(Base):
    expert_ids: List[str] = Field(...)
    chat_name: str = Field(...)
