from datetime import datetime

from pydantic import BaseModel


class ConversationSummaryResponse(BaseModel):
    id: int
    chat_id: int
    summary: str
    updated_at: datetime

    class Config:
        from_attributes = True