from typing import List

from pydantic import Field

from app.models.mongodb import Base


class Chat(Base):
    chat_name: str = Field(...)
    expert_ids: List[str] = Field(...)
    created_by: str = Field(...)
