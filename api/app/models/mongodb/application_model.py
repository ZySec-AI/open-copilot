from typing import List

from pydantic import BaseModel, HttpUrl


class Value(BaseModel):
    required: bool
    type: str


class ConfigurationItem(BaseModel):
    name: str
    description: str
    value: Value


class Application(BaseModel):
    name: str
    description: str
    label: List[str]
    status: str
    rating: float
    configuration: List[ConfigurationItem]
    logo_url: HttpUrl
    website: HttpUrl
