from typing import Optional

from pydantic import BaseModel, Field


class ResponseCategory(BaseModel):
    id: str
    name: Optional[str]
    description: str = None
    can_visible: Optional[bool] = Field(True, example=True)
    can_edit: Optional[bool] = Field(True, example=True)
