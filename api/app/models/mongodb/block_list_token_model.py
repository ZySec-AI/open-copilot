from datetime import datetime

from pydantic import BaseModel


class BlockListToken(BaseModel):
    token: str
    expires: datetime
