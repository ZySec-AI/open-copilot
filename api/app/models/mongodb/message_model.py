from typing import List, Optional

from pydantic import Field

from app.models.mongodb import Base


class Message(Base):
    chat_id: str = Field(...)
    user_prompt: str = Field(...)
    response: Optional[List[dict]] = Field(None)
    last_message_id: Optional[str] = Field(None)
    created_by: str = Field(...)
