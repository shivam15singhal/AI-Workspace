from datetime import datetime

from pydantic import BaseModel
from typing import List

class ChatCreate(BaseModel):
    pass


class ChatResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True