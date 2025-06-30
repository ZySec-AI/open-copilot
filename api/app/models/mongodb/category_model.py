from typing import Optional

from pydantic import BaseModel, Field


class Category(BaseModel):
    name: str = Field(..., example="Project")
    description: str = Field(None, example="Project related documents")
    can_visible: Optional[bool] = Field(True, example=True)
    can_edit: Optional[bool] = Field(True, example=True)
