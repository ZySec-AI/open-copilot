from datetime import datetime
from typing import List

from pydantic import Field, EmailStr

from app.models.mongodb import Base


class User(Base):
    email: EmailStr = Field(...)
    full_name: str = Field(default='')
    password: str = Field(...)
    is_active: bool = Field(default=True)
    last_login: datetime = Field(default=None)
    roles: List[str] = Field(default=['User'])
    api_keys: List[str] = Field(default=[])
