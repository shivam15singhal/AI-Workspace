from datetime import datetime

from pydantic import BaseModel,Field
from typing import List

class ChatCreate(BaseModel):
    pass


class ChatResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatUpdate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )