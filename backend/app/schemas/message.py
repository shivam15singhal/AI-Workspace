from datetime import datetime

from pydantic import BaseModel, Field


class MessageCreate(BaseModel):
    chat_id: int
    content: str
    model: str | None = None


class MessageUpdate(BaseModel):
    content: str = Field(
        min_length=1,
    )


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True