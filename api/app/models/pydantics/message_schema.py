from typing import List, Optional

from pydantic import Field

from app.models.pydantics import Base
from app.models.pydantics.user_schema import UserBasicInfoResponse


class ResponseMessage(Base):
    chat_id: str = Field(..., example="1ac9e1234fgh5678ij90klmn")
    user_prompt: str = Field(..., example="What is the weather today?")
    response: Optional[List[dict]] = Field(None)
    last_message_id: Optional[str] = Field(None, example="1ac9e1234fgh5678ij90klmn")
    created_by: Optional[UserBasicInfoResponse] = Field(..., example="1ac9e1234fgh5678ij90klmn")
