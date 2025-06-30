from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict

from app.models.pydantics import Base


class CreateUser(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'email': 'test@example.com',
                'full_name': 'Test User',
                'password': 'password',
                'roles': ['admin', 'editor']
            }
        }
    )
    
    email: EmailStr = Field(...)
    full_name: str = Field(default='')
    password: str = Field(...)
    roles: List[str] = Field(default=[])


class UpdateUser(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'email': 'user@example.com',
                'full_name': 'User',
                'roles': ['User']
            }
        }
    )
    
    email: EmailStr
    full_name: str = Field(default='')
    roles: List[str] = Field(default=[])


class ResponseUser(Base):
    email: EmailStr
    full_name: Optional[str]
    is_active: bool
    last_login: Optional[datetime]
    roles: Optional[List[str]]
    is_active: bool = True


class UserBasicInfoResponse(BaseModel):
    id: Optional[str]
    email: Optional[EmailStr]
    full_name: Optional[str]
