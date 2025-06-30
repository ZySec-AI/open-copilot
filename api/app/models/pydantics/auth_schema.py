from pydantic import BaseModel, EmailStr


class AuthUser(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    token: str
    token_type: str


class ResponseToken(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
